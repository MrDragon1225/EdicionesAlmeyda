import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        title: { type: String, required: true },
        unit_price: { type: Number, required: true },
        quantity: { type: Number, default: 1 },
    }],
    totalAmount: { type: Number, required: true },
    status: {
        type: String,
        enum: ['pendiente', 'pagado', 'fallido'], // Asegúrate de que 'pendiente' es un valor permitido
        default: 'pendiente',
    },
    shippingAddress: String,
    phone: String,
    email: String,
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Order', orderSchema);