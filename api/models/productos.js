import { Schema, model } from 'mongoose';
import mongoose from 'mongoose';

const productoSchema = new Schema({
    nombre: { type: String, required: true },
    descripcion: { type: String },
    categoria: { type: String, required: true },
    precio: { type: Number, required: true },
    imagen: { type: String }
});


const Producto = mongoose.model("Producto", productoSchema);

export default Producto;

export const getProductById = async (id) => {
    console.log("ID recibido:", id);  
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("ID de producto inválido");
    }
    return await Producto.findById(id);
};
