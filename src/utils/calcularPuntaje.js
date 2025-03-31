/**
 * Calcula puntajes de riesgo psicosocial basado en respuestas a 72 preguntas.
 * @param {Object} preguntas - Objeto con las respuestas (pregunta1: "Siempre", ...)
 * @param {boolean} [esJefe=false] - Indica si el encuestado es jefe
 * @param {boolean} [servicioClientes=false] - Indica si atiende clientes
 * @returns {Object} - { puntajeTotal, puntajesPorCategoria, puntajesPorDominio }
 */
const calcularPuntaje = (preguntas, esJefe = false, servicioClientes = false) => {
  // Configuración de grupos
  const GRUPO_1 = new Set([1, 4, 23, 24, 25, 26, 27, 28, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 55, 56, 57]);
  const GRUPO_2 = new Set([2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 29, 54, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72]);

  const VALORES_RESPUESTA = {
    GRUPO_1: { "Siempre": 0, "Casi siempre": 1, "Algunas veces": 2, "Casi nunca": 3, "Nunca": 4 },
    GRUPO_2: { "Siempre": 4, "Casi siempre": 3, "Algunas veces": 2, "Casi nunca": 1, "Nunca": 0 }
  };

  // Definición de categorías y dominios (mantener tu estructura actual)
  const CATEGORIAS = {
    "Ambiente de trabajo": [1, 2, 3, 4, 5],
    "Factores propios de la actividad": [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
    "Organización del tiempo de trabajo": [17, 18, 19, 20, 21, 22],
    "Liderazgo y relaciones en el trabajo": [31, 32, 33, 34, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 69, 70, 71, 72],
    "Entorno organizacional": [47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64],
  };
  const DOMINIOS = {
    "Condiciones en el ambiente de trabajo": [1, 2, 3, 4],
    "Carga de trabajo": [6, 7, 8, 9, 10, 11, 65, 66, 67, 68],
    "Falta de control sobre el trabajo": [23, 24, 25, 26, 27, 28, 29, 30, 35, 36],
    "Jornada de trabajo": [17, 18],
    "Interferencia en la relación trabajo-familia": [19, 20, 21, 22],
    "Liderazgo": [31, 32, 33, 34, 37, 38, 39, 40, 41],
    "Relaciones en el trabajo": [42, 43, 44, 45, 46, 69, 70, 71, 72],
    "Violencia": [57, 58, 59, 60, 61, 62, 63, 64],
    "Reconocimiento del desempeño": [47, 48, 49, 50, 51, 52],
    "Insuficiente sentido de pertenencia e inestabilidad": [53, 54, 55, 56],
  };

  // Inicialización de resultados
  let puntajeTotal = 0;
  const puntajesPorCategoria = {};
  const puntajesPorDominio = {};

  // Inicializar estructuras con ceros
  Object.keys(CATEGORIAS).forEach(categoria => puntajesPorCategoria[categoria] = 0);
  Object.keys(DOMINIOS).forEach(dominio => puntajesPorDominio[dominio] = 0);

  // Procesar cada pregunta
  for (let i = 1; i <= 72; i++) {
    const respuesta = preguntas[`pregunta${i}`];

    // Validar si la pregunta debe procesarse
    if (i >= 65 && i <= 68) {
      // Preguntas 65-68: Solo si atiende clientes
      if (!servicioClientes) continue;
    } else if (i >= 69 && i <= 72) {
      // Preguntas 69-72: Solo si es jefe
      if (!esJefe) continue;
    }
    // Preguntas 1-64: Siempre se procesan

    // Validar respuesta existente (para preguntas que deben procesarse)
    if (respuesta === undefined || respuesta === null) {
      throw new Error(`Pregunta ${i} no tiene respuesta pero es requerida`);
    }

    // Determinar valor según grupo
    let valor = 0;
    if (GRUPO_1.has(i)) {
      valor = VALORES_RESPUESTA.GRUPO_1[respuesta] ?? 0;
    } else if (GRUPO_2.has(i)) {
      valor = VALORES_RESPUESTA.GRUPO_2[respuesta] ?? 0;
    }

    // Acumular puntajes
    puntajeTotal += valor;

    // Asignar a categorías y dominios
    Object.entries(CATEGORIAS).forEach(([categoria, preguntasCategoria]) => {
      if (preguntasCategoria.includes(i)) {
        puntajesPorCategoria[categoria] += valor;
      }
    });

    Object.entries(DOMINIOS).forEach(([dominio, preguntasDominio]) => {
      if (preguntasDominio.includes(i)) {
        puntajesPorDominio[dominio] += valor;
      }
    });
  }

  // Validar resultados
  const categoriasValidas = Object.values(puntajesPorCategoria).every(v => typeof v === 'number');
  const dominiosValidos = Object.values(puntajesPorDominio).every(v => typeof v === 'number');

  if (!categoriasValidas || !dominiosValidos) {
    throw new Error('Error en el cálculo de puntajes: valores no numéricos detectados');
  }

  return {
    puntajeTotal,
    puntajesPorCategoria,
    puntajesPorDominio
  };
};

module.exports = calcularPuntaje;