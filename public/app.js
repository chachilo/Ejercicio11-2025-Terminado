document.getElementById('cuestionarioForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita que el formulario se envíe de forma tradicional

    // Captura las respuestas del formulario
    const respuestas = {
        preguntas: {},
        servicioClientes: document.getElementById('servicioClientes').value,
        esJefe: document.getElementById('esJefe').value,
    };

    // Recorre todas las preguntas y captura sus valores
    for (let i = 1; i <= 72; i++) {
        const pregunta = document.querySelector(`select[name="pregunta${i}"]`);
        if (pregunta && pregunta.value) {
            respuestas.preguntas[`pregunta${i}`] = pregunta.value;
        }
    }

    // Envía los datos al backend
    try {
        const response = await fetch('http://localhost:3000/api/respuestas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(respuestas), // Convierte los datos a JSON
        });

        // Verifica si la respuesta es exitosa
        if (response.ok) {
            const data = await response.json();
            console.log('Respuesta guardada:', data);

            // Muestra los resultados en la sección correspondiente
            document.getElementById('resultadoPuntaje').textContent = data.puntajeTotal;
            document.getElementById('resultadoNivelRiesgo').textContent = data.nivelRiesgo;
            document.getElementById('resultadoAcciones').textContent = obtenerAccionesRecomendadas(data.nivelRiesgo);

            // Muestra la sección de resultados
            document.getElementById('resultados').style.display = 'block';
        } else {
            console.error('Error al enviar las respuestas:', response.statusText);
            alert('Hubo un error al enviar las respuestas.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un error al enviar las respuestas.');
    }
});

// Función para obtener las acciones recomendadas según el nivel de riesgo
function obtenerAccionesRecomendadas(nivelRiesgo) {
    const acciones = {
        "Muy alto": "Se requiere realizar el análisis de cada categoría y dominio para establecer las acciones de intervención apropiadas...",
        "Alto": "Se requiere realizar un análisis de cada categoría y dominio...",
        "Medio": "Se requiere revisar la política de prevención de riesgos psicosociales...",
        "Bajo": "Es necesario una mayor difusión de la política de prevención de riesgos psicosociales...",
        "Nulo": "El riesgo resulta despreciable por lo que no se requiere medidas adicionales."
    };
    return acciones[nivelRiesgo];
}