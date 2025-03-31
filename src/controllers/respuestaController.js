const mongoose = require('mongoose');
const Respuesta = require('../models/respuesta');
const Empresa = require('../models/empresa');
const calcularPuntaje = require('../utils/calcularPuntaje');

// Función para guardar respuesta (sin transacciones)
const guardarRespuesta = async (req, res) => {
  const { preguntas, servicioClientes, esJefe, empresaId } = req.body;

  // Validación del cuerpo de la solicitud
  if (!preguntas || typeof preguntas !== 'object' || Object.keys(preguntas).length === 0) {
    return res.status(400).json({
      success: false,
      error: 'El objeto de preguntas es requerido y debe contener respuestas'
    });
  }

  try {
    // Validación de empresaId
    if (!empresaId || !mongoose.Types.ObjectId.isValid(empresaId)) {
      return res.status(400).json({ 
        success: false,
        error: 'ID de empresa no válido o faltante' 
      });
    }

    // Conversión a booleanos
    const servicioClientesBool = ['true', 'sí', 'si', 'yes', '1'].includes(String(servicioClientes).toLowerCase()) || servicioClientes === true;
    const esJefeBool = ['true', 'sí', 'si', 'yes', '1'].includes(String(esJefe).toLowerCase()) || esJefe === true;

    // Clonar preguntas para no modificar el objeto original
    const preguntasProcesadas = {...preguntas};

    // Eliminar preguntas condicionales no aplicables
    if (!esJefeBool) {
      [69, 70, 71, 72].forEach(p => delete preguntasProcesadas[`pregunta${p}`]);
    }
    
    if (!servicioClientesBool) {
      [65, 66, 67, 68].forEach(p => delete preguntasProcesadas[`pregunta${p}`]);
    }

    // Validar preguntas obligatorias (1-64)
    const preguntasObligatorias = Array.from({length: 64}, (_, i) => `pregunta${i+1}`);
    const faltantes = preguntasObligatorias.filter(p => !(p in preguntasProcesadas));
    
    if (faltantes.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Faltan respuestas obligatorias',
        preguntasFaltantes: faltantes.map(p => parseInt(p.replace('pregunta', '')))
      });
    }

    // Calcular puntajes
    const { puntajeTotal, puntajesPorCategoria, puntajesPorDominio } = calcularPuntaje(preguntasProcesadas);
    
    // Validación de los cálculos
    if (typeof puntajeTotal !== 'number' || isNaN(puntajeTotal) ||
        !puntajesPorCategoria || typeof puntajesPorCategoria !== 'object' ||
        !puntajesPorDominio || typeof puntajesPorDominio !== 'object') {
      throw new Error('Los resultados del cálculo de puntajes no son válidos');
    }

    const nivelRiesgo = determinarNivelRiesgo(puntajeTotal);

    // Crear y guardar respuesta (SIN TRANSACCIÓN)
    const nuevaRespuesta = new Respuesta({
      empresaId,
      preguntas: preguntasProcesadas,
      puntajeTotal,
      puntajesPorCategoria,
      puntajesPorDominio,
      servicioClientes: servicioClientesBool,
      esJefe: esJefeBool,
      nivelRiesgo
    });

    await nuevaRespuesta.save(); // Guardado directo
    
    res.status(201).json({
      success: true,
      data: {
        id: nuevaRespuesta._id,
        puntajeTotal,
        nivelRiesgo,
        categorias: Object.keys(puntajesPorCategoria),
        dominios: Object.keys(puntajesPorDominio),
        esJefe: esJefeBool,
        servicioClientes: servicioClientesBool
      }
    });

  } catch (error) {
    console.error('Error al guardar respuesta:', error);
    
    // Mapeo de errores
    const errorMap = {
      'ValidationError': { status: 400, message: 'Error de validación de datos' },
      'CastError': { status: 400, message: 'Tipo de dato incorrecto' },
      'MongoError': { status: 500, message: 'Error de base de datos' },
      'default': { status: 500, message: 'Error interno del servidor' }
    };

    const errorInfo = errorMap[error.name] || errorMap.default;
    
    res.status(errorInfo.status).json({
      success: false,
      error: errorInfo.message,
      details: process.env.NODE_ENV === 'development' ? {
        message: error.message,
        stack: error.stack
      } : undefined
    });
  }
};

// Función para obtener respuestas por empresa (sin cambios)
const getRespuestasByEmpresa = async (req, res) => {
  try {
    const empresaId = req.params.empresaId;
    
    if (!mongoose.Types.ObjectId.isValid(empresaId)) {
      return res.status(400).json({
        success: false,
        message: 'El ID proporcionado no es válido',
        receivedId: empresaId,
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

// Función para determinar nivel de riesgo (sin cambios)
function determinarNivelRiesgo(puntaje) {
  if (puntaje >= 200) return "Muy alto";
  if (puntaje >= 150) return "Alto";
  if (puntaje >= 100) return "Medio";
  if (puntaje >= 50) return "Bajo";
  return "Nulo";
}

module.exports = {
  guardarRespuesta,
  getRespuestasByEmpresa
};