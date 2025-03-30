const Respuesta = require('../models/respuesta');
const calcularPuntaje = require('../utils/calcularPuntaje');

const guardarRespuesta = async (req, res) => {
  const { preguntas, servicioClientes, esJefe } = req.body;

  try {
    // Verifica que las preguntas no estén vacías
    if (!preguntas || Object.keys(preguntas).length === 0) {
      return res.status(400).json({ error: 'Las preguntas no pueden estar vacías' });
    }

    const puntajeTotal = calcularPuntaje(preguntas);

    // Verifica que el puntaje total sea un número válido
    if (isNaN(puntajeTotal)) {
      return res.status(400).json({ error: 'El puntaje total calculado no es válido' });
    }

    const nuevaRespuesta = new Respuesta({
      preguntas,
      puntajeTotal,
      servicioClientes,
      esJefe,
    });

    console.log('Datos a guardar:', nuevaRespuesta);

    await nuevaRespuesta.save();

    res.status(201).json({
      mensaje: 'Respuestas guardadas correctamente',
      puntajeTotal,
      nivelRiesgo: determinarNivelRiesgo(puntajeTotal),
    });
  } catch (error) {
    console.error('Error al guardar las respuestas:', error);
    res.status(500).json({ error: 'Error al guardar las respuestas' });
  }
};

const determinarNivelRiesgo = (puntaje) => {
  if (puntaje >= 200) return "Muy alto";
  if (puntaje >= 150) return "Alto";
  if (puntaje >= 100) return "Medio";
  if (puntaje >= 50) return "Bajo";
  return "Nulo";
};

module.exports = {
  guardarRespuesta,
};