const express = require('express');
const { Shop } = require('../../models/index');
const router = express.Router();
const multer = require('multer');
const upload = multer();



// POST - Crear un nuevo usuario
router.post('/create', upload.none(), async (req, res) => {
    try {
        // Definir los campos requeridos
        const requiredFields = ['username', 'shop_name', 'email'];
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

        // Retornar la respuesta exitosa con el usuario creado
        return res.status(201).json({
            status: 'success',
            message: 'Comercio creado con éxito.',
            data: newUser
        });
    } catch (error) {
        console.error('Error al crear el comercio:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor.'
        });
    }
});

// DELETE - Eliminar un Comercio por ID
router.delete('delete/:id', async (req, res) => {
    try {
        const shopId = parseInt(req.params.id, 10);
        if (isNaN(shopId)) {
            return res.status(400).json({
                status: 'failed',
                message: 'El ID del comercio debe ser un número válido.'
            });
        }

        const shop = await Shop.findByPk(shopId);
        if (!shop) {
            return res.status(404).json({
                status: 'failed',
                message: 'Comercio no encontrado.'
            });
        }

        await Shop.destroy({
            where: { id: shopId }
        });

        return res.status(200).json({
            status: 'success',
            message: 'Comercio eliminado con éxito.'
        });

    } catch (error) {
        console.error('Error al eliminar el comercio:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor.'
        });
    }
});


// ... (código anterior)

// PUT - Actualizar un usuario por ID
router.put('update/:id', async (req, res) => {
    try {
        const shopId = parseInt(req.params.id, 10);
        if (isNaN(shopId)) {
            return res.status(400).json({
                status: 'failed',
                message: 'El ID del usuario debe ser un número válido.'
            });
        }

        const shop = await User.findByPk(shopId);
        if (!shop) {
            return res.status(404).json({
                status: 'failed',
                message: 'Usuario no encontrado.'
            });
        }

        // Actualizar solo los campos que se han enviado en la solicitud
        const updatedFields = req.body;
        await Shop.update(updatedFields);

        // Enviar respuesta con el usuario actualizado
        return res.status(200).json({
            status: 'success',
            message: 'Usuario actualizado con éxito.',
            data: user
        });

    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor.'
        });
    }
});


// GET todas las tiendas
router.get('/', async (req, res) => {
    try {
        const shops = await Shop.findAll();
        return res.status(200).json({
            status: 'success',
            message: 'Todas las tiendas obtenidas con éxito.',
            data: shops
        });
    } catch (error) {
        console.error('Error al obtener las tiendas:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor.'
        });
    }
});

// GET shop by ID
router.get('/:id', async (req, res) => {
    try {
        const shopId = parseInt(req.params.id, 10);
        if (isNaN(shopId)) {
            return res.status(400).json({
                status: 'failed',
                message: 'El ID de la tienda debe ser un número válido.'
            });
        }

        const shop = await Shop.findByPk(shopId);
        if (!shop) {
            return res.status(404).json({
                status: 'failed',
                message: 'Tienda no encontrada.'
            });
        }

        // Si la tienda existe, devolvemos los datos
        return res.status(200).json({
            status: 'success',
            message: 'Tienda encontrada con éxito.',
            data: shop
        });

    } catch (error) {
        console.error('Error al buscar la tienda:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor.'
        });
    }
});

module.exports = router;
