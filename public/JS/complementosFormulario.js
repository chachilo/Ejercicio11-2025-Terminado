// Control de envío
let isSubmitting = false;

// Mostrar u ocultar preguntas de atención a clientes
document.getElementById('servicioClientes').addEventListener('change', function() {
  const preguntasClientes = document.getElementById('preguntasClientes');
  preguntasClientes.style.display = this.value === 'Sí' ? 'block' : 'none';
});

// Mostrar u ocultar preguntas de supervisión de trabajadores
document.getElementById('esJefe').addEventListener('change', function() {
  const preguntasJefe = document.getElementById('preguntasJefe');
  preguntasJefe.style.display = this.value === 'Sí' ? 'block' : 'none';
});

// Manejar el inicio de sesión
document.getElementById('loginForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  
  if (isSubmitting) return;
  isSubmitting = true;
  
  const submitBtn = event.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Verificando...';

  try {
    const nombreEmpresa = document.getElementById('nombre-empresa').value;
    const clave = document.getElementById('clave').value;

    const response = await fetch('http://localhost:3000/api/empresas/verify-clave', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombreEmpresa, clave })
    });

    const data = await response.json();

    if (response.ok) {
      mostrarMensajeExito('Credenciales válidas. Cargando formulario...');
      
      // Guardar datos y preparar formulario
      localStorage.setItem('empresaId', data.empresaId);
      localStorage.setItem('empresaNombre', nombreEmpresa);
      
      setTimeout(() => {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('cuestionario').style.display = 'block';
        document.getElementById('contador').textContent = `Eres la persona número ${data.contador} en ingresar al cuestionario de la empresa ${nombreEmpresa} con identificador ${data.empresaId}. Por favor no salgas del formulario hasta terminar o perderás tu participación.`;
        document.getElementById('empresaId').value = data.empresaId;
      }, 1500);
      
    } else {
      mostrarMensajeError(data.message || 'Clave incorrecta');
      document.getElementById('clave').value = '';
      document.getElementById('clave').focus();
    }
  } catch (error) {
    console.error('Error:', error);
    mostrarMensajeError(error.message || 'Error al verificar credenciales');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
    isSubmitting = false;
  }
});

// Asignar empresaId al campo oculto del formulario
const empresaId = new URLSearchParams(window.location.search).get('empresaId') || localStorage.getItem('empresaId');
if (!empresaId && !window.location.pathname.includes('index.html')) {
  mostrarMensajeError('No se encontró el identificador de la empresa. Será redirigido al inicio.');
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 2000);
}
if (document.getElementById('empresaId')) {
  document.getElementById('empresaId').value = empresaId;
}

// Manejar el envío del formulario principal
document.getElementById('cuestionarioForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  
  if (isSubmitting) return;
  isSubmitting = true;
  
  const submitBtn = event.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Enviando...';

  try {
    const empresaId = document.getElementById('empresaId').value || localStorage.getItem('empresaId');
    if (!empresaId) throw new Error('Identificador de empresa no encontrado');

    const servicioClientes = document.getElementById('servicioClientes').value === 'Sí';
    const esJefe = document.getElementById('esJefe').value === 'Sí';
    
    if (document.getElementById('servicioClientes').value === '' || 
        document.getElementById('esJefe').value === '') {
      throw new Error('Por favor responda si es jefe y si atiende clientes');
    }

    const formData = { 
      preguntas: {}, 
      servicioClientes, 
      esJefe, 
      empresaId,
      timestamp: Date.now()
    };

    // Validar preguntas obligatorias (1-64)
    for (let i = 1; i <= 64; i++) {
      const select = document.querySelector(`select[name="pregunta${i}"]`);
      if (!select?.value) throw new Error(`Por favor responda la pregunta ${i}`);
      formData.preguntas[`pregunta${i}`] = select.value;
    }

    // Validar preguntas condicionales (65-68)
    if (servicioClientes) {
      for (let i = 65; i <= 68; i++) {
        const select = document.querySelector(`select[name="pregunta${i}"]`);
        if (!select?.value) throw new Error(`Pregunta ${i} requerida (atención a clientes)`);
        formData.preguntas[`pregunta${i}`] = select.value;
      }
    }

    // Validar preguntas condicionales (69-72)
    if (esJefe) {
      for (let i = 69; i <= 72; i++) {
        const select = document.querySelector(`select[name="pregunta${i}"]`);
        if (!select?.value) throw new Error(`Pregunta ${i} requerida (para jefes)`);
        formData.preguntas[`pregunta${i}`] = select.value;
      }
    }

    // Enviar datos al backend
    const response = await fetch('http://localhost:3000/api/respuestas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al enviar respuestas');
    }

    const resultData = await response.json();
    mostrarMensajeExito('Formulario enviado correctamente. Redirigiendo a resultados...');
    
    setTimeout(() => {
      window.location.href = `resultados.html?empresaId=${empresaId}`;
    }, 2000);

  } catch (error) {
    console.error('Error:', error);
    mostrarMensajeError(error.message);
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
    isSubmitting = false;
  }
});

// Funciones del modal (deben estar definidas en tu HTML)
function mostrarMensajeExito(mensaje) {
  const modal = new bootstrap.Modal(document.getElementById('mensajeModal'));
  document.getElementById('modalTitulo').textContent = 'Éxito';
  document.getElementById('modalTitulo').className = 'modal-title text-success';
  document.getElementById('modalMensaje').textContent = mensaje;
  modal.show();
}

function mostrarMensajeError(mensaje) {
  const modal = new bootstrap.Modal(document.getElementById('mensajeModal'));
  document.getElementById('modalTitulo').textContent = 'Error';
  document.getElementById('modalTitulo').className = 'modal-title text-danger';
  document.getElementById('modalMensaje').textContent = mensaje;
  modal.show();
}