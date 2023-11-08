const express = require('express');
const { Shop } = require('../../models/index'); // Asegúrate de que la ruta sea la correcta
const router = express.Router();


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
