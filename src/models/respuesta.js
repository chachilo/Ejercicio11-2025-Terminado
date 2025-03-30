const mongoose = require('mongoose');

const RespuestaSchema = new mongoose.Schema({
  empresaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Empresa',
    required: true,
  },
  preguntas: {
    type: Object,
    required: true,
  },
  puntajeTotal: {
    type: Number,
    required: true,
  },
  puntajesPorCategoria: {
    type: Object, // Almacena los puntajes por categoría
    required: true,
  },
  puntajesPorDominio: {
    type: Object, // Almacena los puntajes por dominio
    required: true,
  },
  servicioClientes: {
    type: Boolean,
    default: false,
  },
  esJefe: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('Respuesta', RespuestaSchema);