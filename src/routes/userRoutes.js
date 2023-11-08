const express = require('express');
const { User } = require('../../models/index');
const router = express.Router();



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
