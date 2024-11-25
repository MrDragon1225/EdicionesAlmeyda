const express = require('express');
const router = express.Router();
const Order = require('../models/orders'); // Asegúrate de que la ruta del modelo es correcta

// Ruta para crear un nuevo pedido
router.post('/pedidos', async (req, res) => {
    try {
        const { customerName, productos, estado, total, fecha, direccionEnvio,correo } = req.body;
        const newOrder = new Order({
            customerName,
            productos,
            estado,
            total,
            fecha,
            direccionEnvio,
            correo
        });
        
        await newOrder.save(); // Guarda en la base de datos
        res.status(201).json({ message: 'Pedido guardado en la base de datos' });
    } catch (error) {
        console.error('Error al guardar el pedido en la base de datos:', error);
        res.status(500).json({ error: 'Error al guardar el pedido en la base de datos' });
    }
});

// Ruta para obtener todos los pedidos
router.get('/pedidos', async (req, res) => {
    try {
        const pedidos = await Order.find();
        res.json(pedidos); // Retorna los pedidos en formato JSON
    } catch (error) {
        console.error('Error al obtener pedidos:', error);
        res.status(500).json({ error: 'Error al obtener pedidos' });
    }
});
module.exports = router;
