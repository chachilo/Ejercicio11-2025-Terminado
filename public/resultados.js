document.addEventListener('DOMContentLoaded', async () => {
  const empresaSelect = document.getElementById('empresaSelect');
  const loadingDiv = document.getElementById('loading');
  
  // 1. Cargar empresas
  try {
    loadingDiv.style.display = 'block';
    const response = await fetch('http://localhost:3000/api/empresas');
    
    if (!response.ok) throw new Error('Error al cargar empresas');
    
    const { data: empresas } = await response.json();
    
    // Limpiar y poblar select
    empresaSelect.innerHTML = '<option value="" disabled selected>Seleccione empresa</option>';
    
    empresas.forEach(empresa => {
      const option = document.createElement('option');
      option.value = empresa._id; // Asegúrate que usa _id
      option.textContent = `${empresa.nombreEmpresa} (${empresa.cantidadEmpleados} empleados)`;
      empresaSelect.appendChild(option);
    });
    
  } catch (error) {
    console.error('Error:', error);
    empresaSelect.innerHTML = '<option value="" disabled>Error al cargar empresas</option>';
  } finally {
    loadingDiv.style.display = 'none';
  }

  // 2. Manejar selección de empresa
  empresaSelect.addEventListener('change', async () => {
    const empresaId = empresaSelect.value;
    if (!empresaId) return;

    try {
      loadingDiv.style.display = 'block';
      const response = await fetch(`http://localhost:3000/api/respuestas/empresa/${empresaId}`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al cargar respuestas');
      }
      
      const { data: respuestas } = await response.json();
      
      // Mostrar resultados (implementa esta función según tu UI)
      mostrarResultados(respuestas);
      
    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
    } finally {
      loadingDiv.style.display = 'none';
    }
  });
});

function mostrarResultados(respuestas) {
  const resultadosContainer = document.getElementById('resultadosContainer');
  const respuestasList = document.getElementById('respuestasList');
  const nombreEmpresaSpan = document.getElementById('nombreEmpresa');
  const totalEncuestas = document.getElementById('totalEncuestas');
  const puntajePromedio = document.getElementById('puntajePromedio');
  const nivelRiesgo = document.getElementById('nivelRiesgo');
  const fechaActualizacion = document.getElementById('fechaActualizacion');

  if (!respuestas || respuestas.length === 0) {
    respuestasList.innerHTML = `
      <div class="alert alert-info">
        No se encontraron respuestas para esta empresa
      </div>
    `;
    resultadosContainer.classList.remove('d-none');
    return;
  }

  // Datos generales de la empresa
  nombreEmpresaSpan.textContent = respuestas[0].empresaId?.nombreEmpresa || 'Empresa desconocida';
  totalEncuestas.textContent = respuestas.length;
  
  // Calcular puntaje promedio
  const sumaPuntajes = respuestas.reduce((sum, res) => sum + (res.puntajeTotal || 0), 0);
  const promedio = Math.round(sumaPuntajes / respuestas.length);
  puntajePromedio.textContent = promedio;
  
  // Determinar el nivel de riesgo más frecuente
  const niveles = respuestas.map(r => r.nivelRiesgo).filter(Boolean);
  const nivelMasFrecuente = niveles.length > 0 
    ? niveles.sort((a,b) => 
        niveles.filter(v => v === a).length - 
        niveles.filter(v => v === b).length
      ).pop() 
    : 'Nulo';
  
  // Actualizar badge según nivel de riesgo
  let badgeClass = 'bg-secondary';
  if (nivelMasFrecuente === 'Alto') badgeClass = 'bg-danger';
  else if (nivelMasFrecuente === 'Medio') badgeClass = 'bg-warning text-dark';
  else if (nivelMasFrecuente === 'Bajo') badgeClass = 'bg-success';
  
  nivelRiesgo.innerHTML = `<span class="badge ${badgeClass}">${nivelMasFrecuente}</span>`;
  
  // Fecha de actualización
  const ultimaActualizacion = new Date(Math.max(...respuestas.map(r => new Date(r.updatedAt || r.createdAt))));
  fechaActualizacion.textContent = ultimaActualizacion.toLocaleDateString() + ' ' + ultimaActualizacion.toLocaleTimeString();

  // Generar el HTML de las respuestas
  respuestasList.innerHTML = respuestas.map(respuesta => {
    const fechaEncuesta = new Date(respuesta.createdAt).toLocaleDateString();
    
    return `
    <div class="card card-respuesta mb-4">
      <div class="card-header bg-white d-flex justify-content-between align-items-center">
        <h5 class="mb-0">
          <i class="fas fa-poll me-2 text-primary"></i>
          Encuesta realizada el ${fechaEncuesta}
        </h5>
        <div>
          <span class="badge ${getBadgeClass(respuesta.nivelRiesgo)}">
            ${respuesta.nivelRiesgo || 'Nulo'}
          </span>
          <span class="puntaje-display ms-2">
            <i class="fas fa-star text-warning"></i> ${respuesta.puntajeTotal || '0'}
          </span>
        </div>
      </div>
      
      <div class="card-body">
        <div class="row">
          <!-- Puntajes por Categoría -->
          <div class="col-md-6">
            <div class="card mb-3">
              <div class="card-header bg-light">
                <h6 class="mb-0"><i class="fas fa-layer-group me-2"></i>Puntajes por Categoría</h6>
              </div>
              <div class="card-body">
                ${renderizarPuntajes(respuesta.puntajesPorCategoria, true)}
              </div>
            </div>
          </div>
          
          <!-- Puntajes por Dominio -->
          <div class="col-md-6">
            <div class="card mb-3">
              <div class="card-header bg-light">
                <h6 class="mb-0"><i class="fas fa-sitemap me-2"></i>Puntajes por Dominio</h6>
              </div>
              <div class="card-body">
                ${renderizarPuntajes(respuesta.puntajesPorDominio, false)}
              </div>
            </div>
          </div>
        </div>
        
        <!-- Preguntas y respuestas -->
        <div class="mt-3">
          <h6 class="mb-3"><i class="fas fa-question-circle me-2"></i>Detalle de respuestas</h6>
          <div class="table-responsive">
            <table class="table table-sm table-hover">
              <tbody>
                ${Object.entries(respuesta.preguntas || {}).map(([pregunta, respuestaPregunta]) => `
                  <tr>
                    <td class="fw-bold" style="width: 70%">${pregunta}</td>
                    <td class="text-end">${respuestaPregunta || 'Sin respuesta'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    `;
  }).join('');

  resultadosContainer.classList.remove('d-none');
}

// Función auxiliar para determinar el color del badge
function getBadgeClass(nivel) {
  if (!nivel) return 'bg-secondary';
  nivel = nivel.toLowerCase();
  if (nivel.includes('alto')) return 'bg-danger';
  if (nivel.includes('medio')) return 'bg-warning text-dark';
  if (nivel.includes('bajo')) return 'bg-success';
  return 'bg-secondary';
}

// Función para renderizar los puntajes con barras de progreso
function renderizarPuntajes(puntajes, esCategoria) {
  if (!puntajes) return '<p class="text-muted">No hay datos disponibles</p>';
  
  // Determinar el máximo valor para escalar las barras
  const maxValue = esCategoria ? 50 : 20; // Ajusta según tus necesidades
  
  return Object.entries(puntajes).map(([nombre, valor]) => {
    const porcentaje = Math.min(100, (valor / maxValue) * 100);
    let barColor = 'bg-success';
    
    if (porcentaje > 70) barColor = 'bg-danger';
    else if (porcentaje > 40) barColor = 'bg-warning';
    
    return `
    <div class="mb-3">
      <div class="d-flex justify-content-between mb-1">
        <span class="small">${nombre}</span>
        <span class="small fw-bold">${valor}</span>
      </div>
      <div class="progress" style="height: 8px;">
        <div class="progress-bar ${barColor}" 
             role="progressbar" 
             style="width: ${porcentaje}%" 
             aria-valuenow="${valor}" 
             aria-valuemin="0" 
             aria-valuemax="${maxValue}">
        </div>
      </div>
    </div>
    `;
  }).join('');
}