import mercadopago from 'mercadopago';
import { getProductById } from '../models/productos.js';
import User from '../models/user.js';  
import Order from '../models/order.js'; 

mercadopago.configure({
    access_token: "APP_USR-3081024811616420-120319-f0a1648308a3d6a547a32cd549981477-2136840526",
});

export const createOrder = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: "Usuario no autenticado" });
    }

    const carrito = req.body.productIds; // Los IDs de los productos que vienen en el body

    if (!carrito || carrito.length === 0) {
        return res.status(400).json({ error: "El carrito está vacío." });
    }

    try {
        // Obtener los productos desde la base de datos
        const products = [];
        let totalAmount = 0;

        for (const productId of carrito) {
            const producto = await getProductById(productId);
            if (producto) {
                // Asegúrate de tener el precio y el ID del producto
                products.push({
                    productId: producto._id,
                    title: producto.nombre,
                    unit_price: producto.precio,
                    quantity: 1,
                    currency_id: "PEN",
                });
                totalAmount += producto.precio; // Sumar al total
            }
        }

        if (products.length === 0) {
            return res.status(400).json({ error: "No se pudieron procesar productos válidos." });
        }

        // Crear la preferencia en Mercado Pago
        const preference = await mercadopago.preferences.create({
            items: products,
            back_urls: {
                success: '/success',
                failure: '/failure',
                pending: '/pending',
            },
            notification_url: '/webhook',
        });

        // Guardar la orden en la base de datos, incluyendo el userId
        const newOrder = new Order({
            userId: req.user.id,
            products: products,
            status: 'pendiente', // Ajustar si es necesario según el modelo
            totalAmount: totalAmount, // Añadir el totalAmount calculado
            shippingAddress: req.user.direccion, // Suponiendo que tienes esta información en el modelo `User`
            phone: req.user.telefono,
            email: req.user.email,
            createdAt: new Date(),
        });

        await newOrder.save();

        return res.status(200).json({
            success: true,
            init_point: preference.body.init_point,
        });
    } catch (error) {
        console.error("Error al crear la orden:", error.message || error);
        return res.status(500).json({ error: "Hubo un error al procesar la orden. Intente nuevamente." });
    }
};

export const reciveWebhook = async (req, res) => {
    const payment = req.query;

    try {
        if (payment.type === 'payment') {
            const data = await mercadopago.payment.findById(payment['data.id']);
            console.log(data);
            // Almacenar en la base de datos si es necesario
        }

        res.sendStatus(204);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
};
