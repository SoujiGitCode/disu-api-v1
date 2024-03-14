const express = require('express');
const { User } = require('../../models/index');
const multer = require('multer');
const upload = multer();
const router = express.Router();
const { SequelizeUniqueConstraintError } = require('sequelize/lib/errors');
const axios = require('axios');
require('dotenv').config();
const emailService = require('../services/emailService');



console.log(process.env.SENDGRID_API_KEY)
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

router.post('/create', upload.none(), async (req, res) => {
    try {
        // Definir los campos requeridos
        const requiredFields = ['username', 'name', 'last_name', 'dni', 'email'];
        let missingFields = [];

        // Verificar que cada campo requerido esté presente y no sea vacío
        requiredFields.forEach(field => {
            if (!req.body[field] || req.body[field].trim() === '') {
                missingFields.push(field);
            }
        });

        // Si hay campos faltantes, retornar un error
        if (missingFields.length > 0) {
            return res.status(400).json({
                status: 'failed',
                message: `Los siguientes campos son requeridos y no pueden estar vacíos: ${missingFields.join(', ')}.`
            });
        }

        // Crear el nuevo usuario con los datos validados
        const newUser = await User.create({
            username: req.body.username,
            name: req.body.name,
            last_name: req.body.last_name,
            dni: req.body.dni,
            email: req.body.email,
            status: req.body.status,
        });

        // Sendgrid Dinamyc template
        try {
            await emailService.sendWelcomeEmail(newUser);
            console.log('Correo de bienvenida enviado a:', newUser.email);

            // Espera de 3 segundos antes de enviar el siguiente correo
            await sleep(3);

            await emailService.sendQRCodeEmail(newUser);
            console.log('Correo con código QR enviado a:', newUser.email);
        } catch (error) {
            console.error('Error al enviar correo electrónico:', error.message);
        }


        // First Sendgid Sent to verify Api key
        // const sgMail = require('@sendgrid/mail')
        // sgMail.setApiKey(process.env.SENDGRID_API_KEY)
        // const msg = {
        //     to: newUser.email, // Change to your recipient
        //     from: 'info@disu.app', // Change to your verified sender
        //     subject: 'Sending with SendGrid is Fun',
        //     text: 'and easy to do anywhere, even with Node.js',
        //     html: '<strong>and easy to do anywhere, even with Node.js</strong>',
        // }
        // sgMail
        //     .send(msg)
        //     .then(() => {
        //         console.log('Email sent')
        //     })
        //     .catch((error) => {
        //         console.error(error)
        //     })

        // Retornar la respuesta exitosa con el usuario creado
        return res.status(201).json({
            status: 'success',
            message: 'Usuario creado con éxito.',
            data: newUser
        });
    } catch (error) {
        // Manejo de errores de restricción única
        if (error.name === 'SequelizeUniqueConstraintError') {
            const duplicatedField = Object.keys(error.fields)[0]; // Esto debería darte el campo que causó el error
            return res.status(400).json({
                status: 'failed',
                message: `El valor proporcionado para el campo '${duplicatedField}' ya está en uso.`
            });
        }


        console.error('Error al crear el usuario:', error);

        return res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor.'
        });
    }
});

// DELETE - Eliminar un usuario por ID
router.delete('/delete/:id', async (req, res) => {
    try {
        const userId = parseInt(req.params.id, 10);
        if (isNaN(userId)) {
            return res.status(400).json({
                status: 'failed',
                message: 'El ID del usuario debe ser un número válido.'
            });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                status: 'failed',
                message: 'Usuario no encontrado.'
            });
        }

        await User.destroy({
            where: { id: userId }
        });

        return res.status(200).json({
            status: 'success',
            message: 'Usuario eliminado con éxito.'
        });

    } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor.'
        });
    }
});

// PUT - Actualizar un usuario por ID
router.put('/update/:id', upload.none(), async (req, res) => {
    try {
        const userId = parseInt(req.params.id, 10);
        if (isNaN(userId)) {
            return res.status(400).json({
                status: 'failed',
                message: 'El ID del usuario debe ser un número válido.'
            });
        }

        // Filtrar campos vacíos
        const fieldsToUpdate = Object.fromEntries(
            Object.entries(req.body)
                .filter(([_, value]) => value.trim() !== '')
        );

        if (Object.keys(fieldsToUpdate).length === 0) {
            return res.status(400).json({
                status: 'failed',
                message: 'No hay campos para actualizar.'
            });
        }

        const [updateCount] = await User.update(fieldsToUpdate, { where: { id: userId } });

        if (updateCount === 0) {
            return res.status(404).json({
                status: 'failed',
                message: 'Usuario no encontrado o no se requiere actualización.'
            });
        }

        const updatedUser = await User.findByPk(userId);
        return res.status(200).json({
            status: 'success',
            message: 'Usuario actualizado con éxito.',
            data: updatedUser
        });

    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor.'
        });
    }
});

// GET every user registered

router.get('/', async (req, res) => {
    try {
        const users = await User.findAll();
        return res.status(200).json({
            status: 'success',
            message: 'Todos los usuarios obtenidos con éxito.',
            data: users
        });
    } catch (error) {
        console.error('Error al obtener los usuarios:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor.'
        });
    }
});

// Verificar si un usuario existe por correo electrónico
router.get('/registered', async (req, res) => {
    const { email } = req.query;

    // Asegurarse de que se proporcionó un correo electrónico
    if (!email) {
        return res.status(400).json({
            status: 'failed',
            message: 'El correo electrónico es requerido.'
        });
    }

    try {
        // Buscar al usuario por su correo electrónico
        const user = await User.findOne({ where: { email } });

        // Si el usuario existe, devolver información relevante, de lo contrario indicar que no existe
        if (user) {
            return res.status(200).json({
                status: 'success',
                message: 'El usuario existe y está registrado en DISU.',
                exists: true
            });
        } else {
            return res.status(404).json({
                status: 'failed',
                message: 'El usuario no existe.',
                exists: false
            });
        }
    } catch (error) {
        console.error('Error al verificar la existencia del usuario:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor.'
        });
    }
});




// GET user by ID
router.get('/:id', async (req, res) => {
    try {
        const userId = parseInt(req.params.id, 10);
        if (isNaN(userId)) {
            return res.status(400).json({
                status: 'failed',
                message: 'El ID del usuario debe ser un número válido.'
            });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                status: 'failed',
                message: 'Usuario no encontrado.'
            });
        }

        // Si el usuario existe, devolvemos los datos
        return res.status(200).json({
            status: 'success',
            message: 'Usuario encontrado con éxito.',
            data: user
        });

    } catch (error) {
        console.error('Error al buscar el usuario:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor.'
        });
    }
});




module.exports = router;
