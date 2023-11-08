const express = require('express');
const { Transaction, User, Shop } = require('../../models/index');
const multer = require('multer');
const upload = multer();
const router = express.Router();


// GET todas las transacciones
router.get('/', async (req, res) => {
    try {
        const transactions = await Transaction.findAll();
        return res.status(200).json({
            status: 'success',
            message: 'Todas las transacciones obtenidas con éxito.',
            data: transactions
        });
    } catch (error) {
        console.error('Error al obtener las transacciones:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor.'
        });
    }
});

// POST para crear una nueva transacción
router.post('/create', upload.none(), async (req, res) => {
    try {
        // Extrae los datos del cuerpo de la solicitud
        const { user_id, shop_id, init_amount, discount, final_amount } = req.body;

        // Verifica que todos los campos necesarios estén presentes y no estén vacíos
        const requiredFields = ['user_id', 'shop_id', 'init_amount', 'discount', 'final_amount'];
        for (let field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({
                    status: 'failed',
                    message: `El campo ${field} es requerido y no puede estar vacío.`
                });
            }
        }

        // Verificar si el usuario y la tienda existen
        const user = await User.findByPk(user_id);
        if (!user) {
            return res.status(404).json({
                status: 'failed',
                message: 'Usuario no encontrado.'
            });
        }

        const shop = await Shop.findByPk(shop_id);
        if (!shop) {
            return res.status(404).json({
                status: 'failed',
                message: 'Tienda no encontrada.'
            });
        }

        // Crear la transacción
        const transaction = await Transaction.create({
            user_id,
            shop_id,
            init_amount,
            discount,
            final_amount
        });

        return res.status(201).json({
            status: 'success',
            message: 'Transacción creada con éxito.',
            data: transaction
        });

    } catch (error) {
        console.error('Error al crear la transacción:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor.'
        });
    }
});

module.exports = router;
