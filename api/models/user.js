import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  nombre: { type: String, default: null },
  apellidos: { type: String, default: null },
  direccion: { type: String, default: null },
  telefono: { type: String, default: null }
});

// Encriptado de la Contraseña
userSchema.methods.encryptPassword = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

userSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
}

export default model('users', userSchema);

