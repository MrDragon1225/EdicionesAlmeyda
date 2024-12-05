// models/Contact.js
import { Schema, model } from 'mongoose';

const contactSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    section: {
        type: String,
        required: true,
        enum: ['reembolso', 'otros'],  // Limitamos las opciones a las disponibles
    },
    other_message: {
        type: String,
        required: false,  // Solo se requiere si la sección es "Otros"
    },
    message: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const Contact = model('Contact', contactSchema);
export default Contact;
