import { Router } from 'express';
const router = Router();
import passport from 'passport';
import User from '../models/user.js';
import { mostrarIndex } from '../controllers/index.controller.js';
import Order from '../models/order.js';
import Contact from '../models/contacto.js';
import Product from '../models/productos.js';

router.get('/', mostrarIndex);

router.get('/nosotros', (req, res, next) => {
    res.render('nosotros', { user: req.user || null });
});

router.get('/contacto', (req, res, next) => {
    res.render('contacto', { user: req.user || null });
}), 

router.get('/novedades', (req, res, next) => {
    res.render('novedades', { user: req.user || null });
}), 

router.get('/signup', (req, res,next) =>{
    res.render('signup');
});

router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/',
    failureRedirect: '/signup',
    passReqToCallback: true
}));

router.get('/signin', (req, res,next) =>{
    res.render('signin');
});

router.post('/signin', passport.authenticate('local-signin', {
    successRedirect: '/',
    failureRedirect: '/signin',
    passReqToCallback: true
}));

router.get('/logout', (req,res,next) =>{
    req.logout((err) => {
        if (err) {
            return next(err); 
        }
        res.redirect('/');
    });
});

router.post('/update-profile', async (req, res) => {
    try {
        const userId = req.user._id;
        const { nombre, apellidos, direccion, telefono } = req.body;

        // Validar que todos los campos estén presentes
        if (!nombre || !apellidos || !direccion || !telefono) {
            req.flash('errorPerfilMessage', 'Todos los campos son obligatorios.');
            return res.redirect('/profile');
        }

        // Verificar si el usuario existe
        const user = await User.findById(userId);
        if (!user) {
            req.flash('errorPerfilMessage', 'Usuario no encontrado.');
            return res.redirect('/profile');
        }

        // Actualizar los datos en la base de datos
        user.nombre = nombre;
        user.apellidos = apellidos;
        user.direccion = direccion;
        user.telefono = telefono;

        await user.save(); // Guardar los cambios
        
        req.flash('perfilMessage', 'Perfil actualizado correctamente.');
        res.redirect('/profile');
    } catch (error) {
        console.error('Error al actualizar el perfil:', error);
        req.flash('errorPerfilMessage', 'Hubo un problema al actualizar el perfil.');
        res.redirect('/profile');
    }
});

router.post('/enviar-contacto', async (req, res) => {
    const { name, email, section, other_message, message } = req.body;

    if (!name || !email || !message || !section) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    try {
        const newContact = new Contact({
            name,
            email,
            section,  // Agregamos la sección seleccionada
            other_message: section === 'otros' ? other_message : null,  // Guardamos el mensaje solo si es "Otros"
            message,
        });

        await newContact.save(); // Guardar el contacto en la base de datos

        // Aquí podrías enviar un correo al staff notificando que se ha recibido un mensaje
        // Por ejemplo, usando un servicio de email como nodemailer

        res.status(200).json({ message: 'Mensaje enviado correctamente.' });
    } catch (error) {
        console.error("Error al guardar el contacto:", error);
        res.status(500).json({ error: 'Hubo un error al enviar el mensaje. Intenta nuevamente.' });
    }
});

router.get('/orders', async (req, res) => {
    // Obtén el usuario desde req.user o app.locals.user
    const user = req.user || req.app.locals.user;

    if (!user || !user._id) {
        return res.status(401).json({ message: 'No autorizado, usuario no autenticado.' });
    }

    try {
        const orders = await Order.find({ userId: user._id }).populate('products.productId');

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'No se encontraron órdenes para este usuario.' });
        }

        res.json(orders);
    } catch (err) {
        console.error('Error obteniendo órdenes:', err.message);
        res.status(500).json({ message: 'Error al obtener las órdenes.', error: err.message });
    }
});


router.use((req, res, next) => {
    isAuthenticated(req, res, next); //autenticador abajo van las paginas protegidas
    next();
})

//paginas protegidas, el use se ejecuta primero
router.get('/profile', (req, res, next) => {
    const user = req.user || null;
    const wishlist = req.user ? req.user.wishlist : []; 
    const perfilMessage = req.flash('perfilMessage');
    const errorPerfilMessage = req.flash('errorPerfilMessage');
    res.render('profile', { user: user, wishlist: wishlist, message: perfilMessage, message: errorPerfilMessage });
});

router.get('/tienda', (req, res, next) => {
    res.render('tienda', { user: req.user || null });
});

function isAuthenticated(req, res,next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/signin');
};

export default router;