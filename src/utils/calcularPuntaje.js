const calcularPuntaje = (preguntas) => {
  const grupo1 = [1, 4, 23, 24, 25, 26, 27, 28, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 55, 56, 57];
  const grupo2 = [2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 29, 54, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72];

  const categorias = {
    "Ambiente de trabajo": [1, 2, 3, 4, 5],
    "Factores propios de la actividad": [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
    "Organización del tiempo de trabajo": [17, 18, 19, 20, 21, 22],
    "Liderazgo y relaciones en el trabajo": [31, 32, 33, 34, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 69, 70, 71, 72],
    "Entorno organizacional": [47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64],
  };

  const dominios = {
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

  let puntajeTotal = 0;
  const puntajesPorCategoria = {};
  const puntajesPorDominio = {};

  // Inicializar puntajes por categoría y dominio
  Object.keys(categorias).forEach((categoria) => (puntajesPorCategoria[categoria] = 0));
  Object.keys(dominios).forEach((dominio) => (puntajesPorDominio[dominio] = 0));

  for (let i = 1; i <= 72; i++) {
    const respuesta = preguntas[`pregunta${i}`];
    let valor = 0;

    if (grupo1.includes(i)) {
      valor = { "Siempre": 0, "Casi siempre": 1, "Algunas veces": 2, "Casi nunca": 3, "Nunca": 4 }[respuesta] || 0;
    } else if (grupo2.includes(i)) {
      valor = { "Siempre": 4, "Casi siempre": 3, "Algunas veces": 2, "Casi nunca": 1, "Nunca": 0 }[respuesta] || 0;
    }

    puntajeTotal += valor;

    // Sumar a la categoría correspondiente
    for (const [categoria, preguntas] of Object.entries(categorias)) {
      if (preguntas.includes(i)) {
        puntajesPorCategoria[categoria] += valor;
      }
    }

    // Sumar al dominio correspondiente
    for (const [dominio, preguntas] of Object.entries(dominios)) {
      if (preguntas.includes(i)) {
        puntajesPorDominio[dominio] += valor;
      }
    }
  }

  return {
    puntajeTotal,
    puntajesPorCategoria,
    puntajesPorDominio,
  };
};

module.exports = calcularPuntaje;