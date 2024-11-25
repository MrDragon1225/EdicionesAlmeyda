
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const app = express();
const orderRoutes = require('./routes/order');

// Configuración de CORS para permitir cookies
app.use(cors({
    credentials: true
}));
app.use(express.json());

//Usar Ruta
app.use(orderRoutes);


// Conexión a MongoDB
mongoose.connect('mongodb+srv://jose-new:WPXAbwRWYCEUZKUJ@cluster0.2jkla.mongodb.net/edicionesalmeyda', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("Conectado a MongoDB"))
  .catch((error) => console.log("Error al conectar a MongoDB:", error));

// Importa las rutas de productos
const productoRoutes = require('./routes/productos');
app.use(productoRoutes); 

// Configuración del servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor en funcionamiento en el puerto ${PORT}`);
});
