import { Router } from 'express';
const router = Router();
import passport from 'passport';
import User from '../models/user.js';
import { mostrarIndex } from '../controllers/index.controller.js';


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