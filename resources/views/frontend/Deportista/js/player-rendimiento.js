(function(){
  // Datos simulados
  const observaciones = [
    {fecha:'2025-09-05', tipo:'Técnica', detalle:'Mejorar control orientado'},
    {fecha:'2025-09-07', tipo:'Táctica', detalle:'Mejorar posicionamiento en defensa'},
  ];

  const stats = [
    {m:'Asistencias', v: 12},
    {m:'Goles', v: 8},
    {m:'Partidos', v: 20},
    {m:'Prom. Evaluación', v: 4.1},
    {m:'Estado físico (1-5)', v: 4},
  ];

  const tbodyObs = document.querySelector('#tablaObs tbody');
  const tbodyStats = document.querySelector('#tablaStats tbody');

  function render(){
    tbodyObs.innerHTML = observaciones.map(o=>`<tr><td>${o.fecha}</td><td>${o.tipo}</td><td>${o.detalle}</td></tr>`).join('');
    tbodyStats.innerHTML = stats.map(s=>`<tr><td>${s.m}</td><td>${s.v}</td></tr>`).join('');
  }

  render();
})();
