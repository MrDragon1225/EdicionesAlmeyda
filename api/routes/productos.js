import { Router } from 'express';
const router = Router();
import Producto from '../models/productos.js'; // Importa el modelo de producto

// Ruta para obtener todos los productos
router.get('/productos', async (req, res) => {
    try {
        const productos = await Producto.find();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

export default router;