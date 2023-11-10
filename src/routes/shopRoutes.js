const express = require('express');
const { Shop } = require('../../models/index');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const { SequelizeUniqueConstraintError } = require('sequelize/lib/errors');

// POST - Crear un nuevo Comercio
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
        const newShop = await Shop.create({
            username: req.body.username,
            shop_name: req.body.shop_name,
            email: req.body.email,
            status: req.body.status,
        });

        // Retornar la respuesta exitosa con el usuario creado
        return res.status(201).json({
            status: 'success',
            message: 'Comercio creado con éxito.',
            data: newShop
        });
    } catch (error) {
        console.error('Error al crear el comercio:', error);

        // Manejo de errores de restricción única
        if (error instanceof SequelizeUniqueConstraintError) {
            const duplicatedField = error.fields;
            return res.status(400).json({
                status: 'failed',
                message: `El valor proporcionado para el campo '${Object.keys(duplicatedField)}' ya está en uso.`
            });
        }

        return res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor.'
        });
    }
});

// DELETE - Eliminar un Comercio por ID
router.delete('/delete/:id', async (req, res) => {
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

// PUT - Actualizar un comercio por ID
router.put('/update/:id', upload.none(), async (req, res) => {
    try {
        const shopId = parseInt(req.params.id, 10);
        if (isNaN(shopId)) {
            return res.status(400).json({
                status: 'failed',
                message: 'El ID del comercio debe ser un número válido.'
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

        const [updateCount] = await Shop.update(fieldsToUpdate, { where: { id: shopId } });

        if (updateCount === 0) {
            return res.status(404).json({
                status: 'failed',
                message: 'Comercio  no encontrado o no se requiere actualización.'
            });
        }

        const updatedShop = await Shop.findByPk(shopId);
        return res.status(200).json({
            status: 'success',
            message: 'Comercio  actualizado con éxito.',
            data: updatedShop
        });

    } catch (error) {
        console.error('Error al actualizar el comercio:', error);
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
