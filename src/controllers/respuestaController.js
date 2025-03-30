const mongoose = require('mongoose');
const Respuesta = require('../models/respuesta');
const Empresa = require('../models/empresa');
const calcularPuntaje = require('../utils/calcularPuntaje');

// Función para guardar respuesta
const guardarRespuesta = async (req, res) => {
  const { preguntas, servicioClientes, esJefe, empresaId } = req.body;

  try {
    if (!preguntas || Object.keys(preguntas).length === 0) {
      return res.status(400).json({ error: 'Las preguntas no pueden estar vacías' });
    }

    if (!empresaId) {
      return res.status(400).json({ error: 'El campo empresaId es requerido.' });
    }

    const { puntajeTotal, puntajesPorCategoria, puntajesPorDominio } = calcularPuntaje(preguntas);

    const nuevaRespuesta = new Respuesta({
      empresaId,
      preguntas,
      puntajeTotal,
      puntajesPorCategoria,
      puntajesPorDominio,
      servicioClientes,
      esJefe,
    });

    await nuevaRespuesta.save();

    const nivelRiesgo = determinarNivelRiesgo(puntajeTotal);

    res.status(201).json({
      mensaje: 'Respuestas guardadas correctamente',
      puntajeTotal,
      puntajesPorCategoria,
      puntajesPorDominio,
      nivelRiesgo,
    });
  } catch (error) {
    console.error('Error al guardar las respuestas:', error);
    res.status(500).json({ error: 'Error al guardar las respuestas' });
  }
};

// Función para obtener respuestas por empresa
const getRespuestasByEmpresa = async (req, res) => {
  try {
    const empresaId = req.params.empresaId;
    
    // Validación robusta del ID
    if (!mongoose.Types.ObjectId.isValid(empresaId)) {
      return res.status(400).json({
        success: false,
        message: 'El ID proporcionado no es válido',
        receivedId: empresaId, // Para debugging
        expectedFormat: 'Debe ser un ObjectId de MongoDB (24 caracteres hex)'
      });
    }

    const respuestas = await Respuesta.find({ empresaId: new mongoose.Types.ObjectId(empresaId) })
      .populate('empresaId', 'nombreEmpresa cantidadEmpleados')
      .lean();

    res.json({
      success: true,
      count: respuestas.length,
      data: respuestas
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// Función para determinar nivel de riesgo
function determinarNivelRiesgo(puntaje) {
  if (puntaje >= 200) return "Muy alto";
  if (puntaje >= 150) return "Alto";
  if (puntaje >= 100) return "Medio";
  if (puntaje >= 50) return "Bajo";
  return "Nulo";
}

// Exporta todas las funciones juntas
module.exports = {
  guardarRespuesta,
  getRespuestasByEmpresa
};