document.addEventListener('DOMContentLoaded', function() {
  // Función para mostrar mensajes en el modal con callback
  function mostrarMensaje(titulo, mensaje, esExito = true, callback = null) {
    const modalElement = document.getElementById('mensajeModal');
    if (!modalElement) {
      console.error('Modal no encontrado en el DOM');
      alert(`${titulo}\n\n${mensaje}`);
      if (callback) callback();
      return;
    }

    const modalTitulo = document.getElementById('modalTitulo');
    const modalMensaje = document.getElementById('modalMensaje');
    const modal = new bootstrap.Modal(modalElement);
    const btnAceptar = document.getElementById('modalAceptar');
    
    if (!modalTitulo || !modalMensaje || !btnAceptar) {
      console.error('Elementos del modal no encontrados');
      alert(`${titulo}\n\n${mensaje}`);
      if (callback) callback();
      return;
    }

    // Configurar estilo según si es éxito o error
    modalTitulo.className = esExito ? 'modal-title text-success' : 'modal-title text-danger';
    modalTitulo.textContent = titulo;
    modalMensaje.innerHTML = mensaje;
    
    // Configurar el evento del botón Aceptar
    const handler = () => {
      if (callback) callback();
      btnAceptar.removeEventListener('click', handler);
    };
    
    // Limpiar eventos previos y agregar el nuevo
    btnAceptar.replaceWith(btnAceptar.cloneNode(true));
    document.getElementById('modalAceptar').addEventListener('click', handler);
    
    modal.show();
  }

  // Función para calcular muestra representativa
  function calcularMuestraRepresentativa(N) {
    const constante1 = 0.9604;
    const constante2 = 0.0025;
    const numerador = constante1 * N;
    const denominador = (constante2 * (N - 1)) + constante1;
    const n = numerador / denominador;
    return Math.round(n);
  }

  // Control de envío para evitar múltiples submits
  let isSubmitting = false;

  // Verificar si el formulario existe antes de agregar el event listener
  const empresaForm = document.getElementById('empresaForm');
  if (!empresaForm) {
    console.error('Formulario de empresa no encontrado');
    return;
  }

  empresaForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    if (isSubmitting) return;
    isSubmitting = true;
    
    const submitBtn = event.target.querySelector('button[type="submit"]');
    if (!submitBtn) {
      console.error('Botón de submit no encontrado');
      isSubmitting = false;
      return;
    }

    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Procesando...';

    const nombreEmpresa = document.getElementById('nombre-empresa')?.value;
    const cantidadEmpleados = parseInt(document.getElementById('cantidad-empleados')?.value || 0);
    const clave = document.getElementById('clave')?.value;

    // Validaciones básicas
    if (!nombreEmpresa || !clave || cantidadEmpleados <= 0) {
      mostrarMensaje(
        'Datos incompletos',
        'Por favor complete todos los campos correctamente:\n\n- Nombre de empresa\n- Cantidad de empleados (mayor a 0)\n- Clave de acceso',
        false
      );
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      isSubmitting = false;
      return;
    }

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
        return response.json().then(err => {
          throw new Error(err.message || 'Error en el registro');
        });
      }
      return response.json();
    })
    .then(data => {
      // Crear mensaje con formato HTML
      // Dentro de la función mostrarMensaje en empresa.js
const mensajeHTML = `
<div class="mb-4">
  <div class="text-center mb-3">
    <i class="fas fa-check-circle text-success" style="font-size: 3rem;"></i>
    <h4 class="mt-2 mb-3 fw-bold">Registro Exitoso</h4>
  </div>
  
  <div class="card border-success mb-3">
    <div class="card-header bg-success text-white">
      <i class="fas fa-building me-2"></i>Detalles de la Empresa
    </div>
    <div class="card-body">
      <div class="row">
        <div class="col-md-6 mb-2">
          <div class="d-flex align-items-center">
            <i class="fas fa-signature text-primary me-2"></i>
            <div>
              <small class="text-muted">Nombre</small>
              <div class="fw-bold">${nombreEmpresa}</div>
            </div>
          </div>
        </div>
        
        <div class="col-md-6 mb-2">
          <div class="d-flex align-items-center">
            <i class="fas fa-users text-primary me-2"></i>
            <div>
              <small class="text-muted">Total Empleados</small>
              <div class="fw-bold">${cantidadEmpleados}</div>
            </div>
          </div>
        </div>
        
        <div class="col-md-6 mb-2">
          <div class="d-flex align-items-center">
            <i class="fas fa-chart-pie text-primary me-2"></i>
            <div>
              <small class="text-muted">Muestra Representativa</small>
              <div class="fw-bold">${muestraRepresentativa} empleados</div>
            </div>
          </div>
        </div>
        
        <div class="col-md-6 mb-2">
          <div class="d-flex align-items-center">
            <i class="fas fa-key text-primary me-2"></i>
            <div>
              <small class="text-muted">Clave Asignada</small>
              <div class="fw-bold"><code class="bg-light p-1 rounded">${clave}</code></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <div class="alert alert-success d-flex align-items-center">
    <i class="fas fa-info-circle me-2" style="font-size: 1.5rem;"></i>
    <div>
      <strong>¡Importante!</strong> Guarde esta clave en un lugar seguro. Será necesaria para acceder al sistema.
    </div>
  </div>
</div>
`;
      
      // Mostrar mensaje de éxito en el modal
      mostrarMensaje(
        'Registro exitoso', 
        mensajeHTML,
        true,
        () => {
          // Esta función se ejecutará solo cuando se haga clic en Aceptar
          localStorage.setItem('empresaId', data._id || data.id);
          localStorage.setItem('empresaNombre', nombreEmpresa);
          localStorage.setItem('empresaClave', clave);
          window.location.href = `formulario.html?empresaId=${data._id || data.id}`;
        }
      );
    })
    .catch((error) => {
      console.error('Error:', error);
      mostrarMensaje(
        'Error en el registro',
        `<div class="alert alert-danger">
          <i class="fas fa-exclamation-triangle me-2"></i>
          ${error.message || 'Ocurrió un error al registrar la empresa.'}
        </div>
        <p class="mb-0">Por favor intente nuevamente.</p>`,
        false
      );
    })
    .finally(() => {
      // Restaurar estado del botón
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      isSubmitting = false;
    });
  });

  // Alternar visibilidad de contraseña
  document.getElementById('togglePassword')?.addEventListener('click', function() {
    const passwordInput = document.getElementById('clave');
    const icon = this.querySelector('i');
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
      passwordInput.type = 'password';
      icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
  });
});