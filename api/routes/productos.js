import { Router } from 'express';
import Producto from '../models/productos.js'; // Importa el modelo de producto

const router = Router();

// Ruta para obtener todos los productos
router.get('/productos', async (req, res) => {
    try {
        const productos = await Producto.find();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

// Ruta para mostrar un libro específico
router.get('/libro/:id', async (req, res) => {
    try {
        const libro = await Producto.findById(req.params.id);
        if (!libro) {
            return res.status(404).send('Libro no encontrado');
        }
        res.render('libro', { libro, user: req.user || null });
    } catch (error) {
        console.error('Error al obtener el libro:', error);
        res.status(500).send('Error interno del servidor');
    }
});

export default router;
