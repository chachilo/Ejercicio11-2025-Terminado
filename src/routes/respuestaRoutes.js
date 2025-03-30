const express = require('express');
const router = express.Router();
const Respuesta = require('../models/respuesta');
const calcularPuntaje = require('../utils/calcularPuntaje');

router.post('/', async (req, res) => {
  const { nombre, preguntas, servicioClientes, esJefe } = req.body;

  try {
    const puntajeTotal = calcularPuntaje(preguntas);

    const nuevaRespuesta = new Respuesta({
      nombre,
      preguntas,
      puntajeTotal,
      servicioClientes,
      esJefe,
    });

    await nuevaRespuesta.save();

    res.status(201).json({
      mensaje: 'Respuestas guardadas correctamente',
      nombre: nuevaRespuesta.nombre,
      puntajeTotal,
      nivelRiesgo: determinarNivelRiesgo(puntajeTotal),
    });
  } catch (error) {
    console.error('Error al guardar las respuestas:', error);
    res.status(500).json({ error: 'Error al guardar las respuestas' });
  }
});

function determinarNivelRiesgo(puntaje) {
  if (puntaje >= 200) return "Muy alto";
  if (puntaje >= 150) return "Alto";
  if (puntaje >= 100) return "Medio";
  if (puntaje >= 50) return "Bajo";
  return "Nulo";
}

module.exports = router;