(function(){
  const perfil = {
    nombre:'Juan Lopez', categoria:'Sub-12', posicion:'Delantero', telefono:'', email:'juan.lopez@club.com',
    stats: { asistencias: 12, goles: 8, partidos: 20, promedioEvaluacion: 4.1 }
  };

  const inputNombre = document.getElementById('nombre');
  const inputCategoria = document.getElementById('categoria');
  const inputPosicion = document.getElementById('posicion');
  const inputTelefono = document.getElementById('telefono');
  const inputEmail = document.getElementById('email');
  const formPerfil = document.getElementById('formPerfil');
  const tbodyStats = document.querySelector('#tablaStats tbody');

  function render(){
    inputNombre.value = perfil.nombre;
    inputCategoria.value = perfil.categoria;
    inputPosicion.value = perfil.posicion;
    inputTelefono.value = perfil.telefono;
    inputEmail.value = perfil.email;
    tbodyStats.innerHTML = [
      {m:'Asistencias', v: perfil.stats.asistencias},
      {m:'Goles', v: perfil.stats.goles},
      {m:'Partidos', v: perfil.stats.partidos},
      {m:'Prom. Evaluación', v: perfil.stats.promedioEvaluacion},
    ].map(r=>`<tr><td>${r.m}</td><td>${r.v}</td></tr>`).join('');
  }

  function guardar(e){
    e.preventDefault();
    perfil.nombre = inputNombre.value.trim();
    perfil.posicion = inputPosicion.value.trim();
    perfil.telefono = inputTelefono.value.trim();
    perfil.email = inputEmail.value.trim();
    alert('Datos guardados (simulado)');
  }

  formPerfil.addEventListener('submit', guardar);
  render();
})();
