
import { connect } from 'mongoose';
import express, { json } from 'express';
import cors from 'cors';
const app = express();
import morgan from 'morgan';
import dotenv from "dotenv";
import engine from 'ejs-mate';
import path from 'path';
import passport from 'passport';
import session from 'express-session'
import flash from 'connect-flash';
import auth from './passport/local-auth.js';
import Producto from './models/productos.js';


const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');

//Iniciaciones
dotenv.config();

//middleware
app.use(json());
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(session({
    secret: 'misesionsecreta',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    res.locals.signupMessage = req.flash('signupMessage');
    res.locals.signinMessage = req.flash('signinMessage');
    res.locals.perfilMessage = req.flash('perfilMessage');
    res.locals.errorPerfilMessage = req.flash('errorPerfilMessage');
    app.locals.user = req.user;
    next();
})

// Configuración de CORS para permitir cookies

app.use(cors({
    origin: '*', // Permite todas las conexiones (no recomendado)
    credentials: true,
}));

//utilizando import de las rutas
import paymentRoutes from './routes/payment.js';
import productoRoutes from './routes/productos.js';
import indexRoutes from './routes/index.js';
app.use(paymentRoutes);
app.use(productoRoutes);
app.use('/', indexRoutes);



// Conexión a MongoDB
connect('mongodb+srv://jose-new:WPXAbwRWYCEUZKUJ@cluster0.2jkla.mongodb.net/edicionesalmeyda', {
}).then(() => console.log("Conectado a MongoDB"))
  .catch((error) => console.log("Error al conectar a MongoDB:", error));


// Configuración del servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor en funcionamiento en el puerto ${PORT}`);
});
