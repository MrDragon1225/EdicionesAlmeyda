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

        // Guardar la orden en la base de datos, incluyendo el userId
        const newOrder = new Order({
            userId: req.user.id,
            products: products,
            status: 'pendiente',
            totalAmount: totalAmount, 
            shippingAddress: req.user.direccion, 
            phone: req.user.telefono,
            email: req.user.email,
            createdAt: new Date(),
        });

        await newOrder.save();  // Guardar la orden en la base de datos primero

        // Crear la preferencia en Mercado Pago con el external_reference
        const preference = await mercadopago.preferences.create({
            items: products,
            back_urls: {
                success: 'edicionesalmeyda-production.up.railway.app/success',
                failure: 'edicionesalmeyda-production.up.railway.app/failure',
                pending: 'edicionesalmeyda-production.up.railway.app/pending',
            },
            notification_url: 'edicionesalmeyda-production.up.railway.app/webhook',
            external_reference: newOrder._id.toString(), // Ahora usamos el ID de la orden guardada
        });

        return res.status(200).json({
            success: true,
            init_point: preference.body.init_point,
        });
    } catch (error) {
        console.error("Error al crear la orden:", error.message || error);
        return res.status(500).json({ error: "Hubo un error al procesar la orden. Intente nuevamente." });
    }
};


// Mapeo de estados de MercadoPago a los valores de tu modelo
const estadoMapeo = {
    pending: 'pendiente',
    approved: 'pagado',
    in_process: 'en proceso',
    rejected: 'fallido',
    cancelled: 'cancelado',
    refunded: 'reembolsado'
};

// Recibe el webhook y actualiza la orden
export const reciveWebhook = async (req, res) => {
    try {
        console.log('Webhook recibido:', JSON.stringify(req.body, null, 2));

        const paymentData = req.body;

        if (!paymentData || paymentData.type !== 'payment') {
            console.error('Evento no relacionado con pagos:', paymentData);
            return res.status(200).send('Evento ignorado');
        }

        const paymentId = paymentData.data.id;
        const payment = await mercadopago.payment.findById(paymentId);
        const { external_reference, status } = payment.body;

        const order = await Order.findById(external_reference);
        if (!order) {
            console.error('Orden no encontrada para external_reference:', external_reference);
            return res.status(404).send('Orden no encontrada');
        }

        const estadoTraducido = estadoMapeo[status];
        if (!estadoTraducido) {
            console.error('Estado no válido recibido:', status);
            return res.status(400).send('Estado no válido');
        }

        order.status = estadoTraducido;
        await order.save();

        console.log('Orden actualizada correctamente:', order);
        res.status(200).send('OK');
    } catch (error) {
        console.error('Error procesando webhook:', error);
        res.status(500).send('Error interno');
    }
};


