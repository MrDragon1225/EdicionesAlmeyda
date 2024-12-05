// models/Contact.js
import { Schema, model } from 'mongoose';

const contactSchema = new Schema({
    name: {type: String,required: true,},
    email: {type: String,required: true,},
    section: {type: String,required: true,enum: ['reembolso', 'otros'],
    },other_message: {type: String,required: false,},
    message: {type: String,required: true,},
    createdAt: {type: Date,default: Date.now,}
});

const Contact = model('Contact', contactSchema);
export default Contact;
