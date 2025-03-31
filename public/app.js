 
 /*
 document.addEventListener('DOMContentLoaded', function() {
  // Mostrar/ocultar preguntas condicionales al cambiar selección
  document.getElementById('servicioClientes').addEventListener('change', function() {
    document.getElementById('preguntasClientes').style.display = 
      this.value === 'Sí' ? 'block' : 'none';
  });

  document.getElementById('esJefe').addEventListener('change', function() {
    document.getElementById('preguntasJefe').style.display = 
      this.value === 'Sí' ? 'block' : 'none';
  });

  // Función para mostrar mensaje de éxito
  function mostrarMensajeExito(mensaje) {
    const modalTitulo = document.getElementById('modalTitulo');
    const modalMensaje = document.getElementById('modalMensaje');
    const mensajeModal = new bootstrap.Modal(document.getElementById('mensajeModal'));

    modalTitulo.textContent = 'Éxito';
    modalTitulo.className = 'modal-title text-success';
    modalMensaje.textContent = mensaje;
    mensajeModal.show();
  }

  // Función para mostrar mensaje de error
  function mostrarMensajeError(mensaje) {
    const modalTitulo = document.getElementById('modalTitulo');
    const modalMensaje = document.getElementById('modalMensaje');
    const mensajeModal = new bootstrap.Modal(document.getElementById('mensajeModal'));

    modalTitulo.textContent = 'Error';
    modalTitulo.className = 'modal-title text-danger';
    modalMensaje.textContent = mensaje;
    mensajeModal.show();
  }

  // Manejo del envío del formulario
  document.getElementById('cuestionarioForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    // Obtén el empresaId desde el campo oculto o localStorage
    const empresaId = document.getElementById('empresaId').value || localStorage.getItem('empresaId');

    if (!empresaId) {
      mostrarMensajeError('No se encontró el identificador de la empresa. Por favor, regístrese primero.');
      return;
    }

    // Convertir valores de Sí/No a booleanos
    const servicioClientes = document.getElementById('servicioClientes').value === 'Sí';
    const esJefe = document.getElementById('esJefe').value === 'Sí';

    // Validar que se haya seleccionado Sí/No en ambas preguntas condicionales
    if (document.getElementById('servicioClientes').value === '' || 
        document.getElementById('esJefe').value === '') {
      mostrarMensajeError('Por favor responda ambas preguntas sobre su rol (atención a clientes y si es jefe)');
      return;
    }

    // Captura las respuestas del formulario
    const formData = {
      preguntas: {},
      servicioClientes: servicioClientes,
      esJefe: esJefe,
      empresaId: empresaId
    };

    // Recolectar todas las preguntas (1-64 obligatorias, 65-72 condicionales)
    for (let i = 1; i <= 72; i++) {
      const pregunta = document.querySelector(`select[name="pregunta${i}"]`);
      
      if (pregunta) {
        // Para preguntas 1-64 (obligatorias)
        if (i <= 64) {
          if (!pregunta.value) {
            mostrarMensajeError(`Por favor responda la pregunta ${i}`);
            return;
          }
          formData.preguntas[`pregunta${i}`] = pregunta.value;
        } 
        // Para preguntas 65-68 (atención a clientes)
        else if (i >= 65 && i <= 68) {
          if (servicioClientes && !pregunta.value) {
            mostrarMensajeError(`Por favor responda la pregunta ${i} (requerida para atención a clientes)`);
            return;
          }
          if (servicioClientes) {
            formData.preguntas[`pregunta${i}`] = pregunta.value;
          }
        } 
        // Para preguntas 69-72 (jefes)
        else if (i >= 69 && i <= 72) {
          if (esJefe && !pregunta.value) {
            mostrarMensajeError(`Por favor responda la pregunta ${i} (requerida para jefes)`);
            return;
          }
          if (esJefe) {
            formData.preguntas[`pregunta${i}`] = pregunta.value;
          }
        }
      }
    }

    // Envía los datos al backend
    try {
      const response = await fetch('http://localhost:3000/api/respuestas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        mostrarMensajeExito('Respuestas enviadas correctamente. Será redirigido a los resultados.');
        // Redirigir a la página de resultados después de 2 segundos
        setTimeout(() => {
          window.location.href = 'resultados.html';
        }, 2000);
      } else {
        const errorData = await response.json();
        mostrarMensajeError(`Error al enviar las respuestas: ${errorData.error || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      mostrarMensajeError('Hubo un error al enviar las respuestas. Por favor, intente nuevamente.');
    }
  });
  }); */