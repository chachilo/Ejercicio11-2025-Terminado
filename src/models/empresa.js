const mongoose = require('mongoose');

const empresaSchema = new mongoose.Schema({
    nombreEmpresa: {
        type: String,
        required: true
    },
    cantidadEmpleados: {
        type: Number,
        required: true
    },
    clave: {
        type: String,
        required: true
    },
    muestraRepresentativa: {
        type: Number,
        required: true
    },
    contador: {
        type: Number,
        default: 0
    }
});

const Empresa = mongoose.model('Empresa', empresaSchema);

module.exports = Empresa;