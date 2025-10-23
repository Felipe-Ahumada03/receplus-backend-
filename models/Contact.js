const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  nombre: String,
  apellido: String,
  correo: String,
  asunto: String,
  mensaje: String,
  esUsuario: Boolean,
  fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Contact', contactSchema);
