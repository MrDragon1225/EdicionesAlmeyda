const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    productos: [
        {
            nombre: { type: String, required: true },
            precio: { type: Number, required: true },
            cantidad: { type: Number, required: true }
        }
    ],
    total: { type: Number, required: true },
    estado: { type: String, default: 'pendiente' },
    fecha: { type: Date, default: Date.now },
    direccionEnvio: {type: String, required: true},
    correo: {type: String, required: true}
});

module.exports = mongoose.model('Order', orderSchema);
