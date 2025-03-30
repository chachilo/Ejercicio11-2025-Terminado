const calcularPuntaje = (preguntas) => {
  const grupo1 = [1, 4, 23, 24, 25, 26, 27, 28, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 55, 56, 57];
  const grupo2 = [2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 29, 54, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72];

  let puntajeTotal = 0;

  for (let i = 1; i <= 72; i++) {
    const respuesta = preguntas[`pregunta${i}`];
    let valor = 0;

    if (grupo1.includes(i)) {
      valor = { "Siempre": 0, "Casi siempre": 1, "Algunas veces": 2, "Casi nunca": 3, "Nunca": 4 }[respuesta] || 0;
    } else if (grupo2.includes(i)) {
      valor = { "Siempre": 4, "Casi siempre": 3, "Algunas veces": 2, "Casi nunca": 1, "Nunca": 0 }[respuesta] || 0;
    }

    puntajeTotal += valor;
  }

  return puntajeTotal;
};

module.exports = calcularPuntaje;