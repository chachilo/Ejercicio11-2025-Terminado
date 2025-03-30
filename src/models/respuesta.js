const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const respuestaSchema = new Schema({
  preguntas: { type: Map, of: String, required: true },
  puntajeTotal: { type: Number, required: true },
  servicioClientes: { type: String, required: true },
  esJefe: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Respuesta', respuestaSchema);