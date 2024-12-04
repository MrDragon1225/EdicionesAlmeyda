import Producto from '../models/productos.js';

export const mostrarIndex = async (req, res) => {
    try {
        // Obtener 4 libros aleatorios
        const libros = await Producto.aggregate([{ $sample: { size: 4 } }]);
        res.render('index', { libros, user: req.user || null });
    } catch (error) {
        console.error('Error al obtener libros aleatorios:', error);
        res.status(500).send('Error interno del servidor');
    }
};
