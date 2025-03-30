const form = document.querySelector('form');

form.addEventListener('submit', function(event) {
    event.preventDefault();

    const nombreEmpresa = document.getElementById('nombre-empresa').value;
    const cantidadEmpleados = document.getElementById('cantidad-empleados').value;
    const clave = document.getElementById('clave').value;

    // Calcular la muestra representativa
    const muestraRepresentativa = calcularMuestraRepresentativa(cantidadEmpleados);

    const data = {
        nombreEmpresa: nombreEmpresa,
        cantidadEmpleados: cantidadEmpleados,
        clave: clave,
        muestraRepresentativa: muestraRepresentativa
    };

    fetch('http://localhost:3000/api/empresas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        alert('Datos enviados con éxito');

        // Almacena el identificador de la empresa en el almacenamiento local
        localStorage.setItem('empresaId', data._id);

        // Redirige al usuario al formulario con el identificador de la empresa
        window.location.href = `formulario.html?empresaId=${data._id}`;
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Error al enviar los datos');
    });
});

function calcularMuestraRepresentativa(N) {
    const constante1 = 0.9604;
    const constante2 = 0.0025;
    const numerador = constante1 * N;
    const denominador = (constante2 * (N - 1)) + constante1;
    const n = numerador / denominador;
    return Math.round(n);
}