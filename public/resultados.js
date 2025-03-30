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

  if (!respuestas || respuestas.length === 0) {
    respuestasList.innerHTML = `
      <div class="alert alert-info">
        No se encontraron respuestas para esta empresa
      </div>
    `;
    return;
  }

  // Mostrar el nombre de la empresa (asumiendo que está en la primera respuesta)
  if (respuestas[0].empresaId) {
    nombreEmpresaSpan.textContent = respuestas[0].empresaId.nombreEmpresa || 'Empresa desconocida';
  }

  // Generar el HTML de las respuestas
  respuestasList.innerHTML = respuestas.map(respuesta => `
    <div class="card mb-3">
      <div class="card-header">
        <h5>Encuesta realizada el ${new Date(respuesta.createdAt).toLocaleDateString()}</h5>
      </div>
      <div class="card-body">
        <p><strong>Puntaje Total:</strong> ${respuesta.puntajeTotal || 'N/A'}</p>
        
        <h6>Detalles de las respuestas:</h6>
        ${Object.entries(respuesta.preguntas || {}).map(([pregunta, respuesta]) => `
          <p><strong>${pregunta}:</strong> ${respuesta || 'Sin respuesta'}</p>
        `).join('')}
        
        ${respuesta.puntajesPorCategoria ? `
        <h6 class="mt-3">Puntajes por categoría:</h6>
        ${Object.entries(respuesta.puntajesPorCategoria).map(([categoria, puntaje]) => `
          <p><strong>${categoria}:</strong> ${puntaje}</p>
        `).join('')}
        ` : ''}
      </div>
    </div>
  `).join('');

  resultadosContainer.classList.remove('d-none');
}