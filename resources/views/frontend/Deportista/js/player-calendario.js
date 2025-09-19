(function(){
  function parseDate(d){ return d ? new Date(d).getTime() : null; }
  function inRange(fecha, d1, d2){ const t = parseDate(fecha); if(d1 && t<d1) return false; if(d2 && t>d2) return false; return true; }

  // Datos simulados
  let eventos = [
    {fecha:'2025-09-12', tipo:'Entrenamiento', detalle:'17:00 - Cancha Norte'},
    {fecha:'2025-09-13', tipo:'Partido', detalle:'Vs Panteras'},
  ];
  let convocatorias = [
    {fecha:'2025-09-13', rival:'Panteras', estado:'Convocado'},
  ];
  let resultados = [
    {fecha:'2025-09-06', rival:'Leones B', marcador:'2-1'},
  ];

  const filtroDesde = document.getElementById('filtroDesde');
  const filtroHasta = document.getElementById('filtroHasta');
  const tbodyEventos = document.querySelector('#tablaEventos tbody');
  const tbodyConv = document.querySelector('#tablaConvocatorias tbody');
  const tbodyRes = document.querySelector('#tablaResultados tbody');

  function render(){
    const d1 = parseDate(filtroDesde.value), d2 = parseDate(filtroHasta.value);
    const ev = eventos.filter(e=> inRange(e.fecha, d1, d2));
    const cv = convocatorias.filter(c=> inRange(c.fecha, d1, d2));
    const rs = resultados.filter(r=> inRange(r.fecha, d1, d2));

    tbodyEventos.innerHTML = ev.map(e=>`<tr><td>${e.fecha}</td><td>${e.tipo}</td><td>${e.detalle}</td></tr>`).join('');
    tbodyConv.innerHTML = cv.map(c=>`<tr><td>${c.fecha}</td><td>${c.rival}</td><td><span class="badge ${c.estado==='Convocado'?'success':'muted'}">${c.estado}</span></td></tr>`).join('');
    tbodyRes.innerHTML = rs.map(r=>`<tr><td>${r.fecha}</td><td>${r.rival}</td><td>${r.marcador}</td></tr>`).join('');
  }

  filtroDesde.addEventListener('change', render);
  filtroHasta.addEventListener('change', render);

  render();
})();
