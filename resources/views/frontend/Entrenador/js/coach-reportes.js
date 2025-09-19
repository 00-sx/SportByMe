(function(){
  const { toCSV, download } = window.AdminCommon;

  // Datos simulados coherentes con el rol entrenador
  const jugadores = [ {id:'P-1', nombre:'Juan López'}, {id:'P-2', nombre:'Andrés Gómez'}, {id:'P-3', nombre:'Pedro Ríos'} ];

  const dataset = {
    asistencias: [
      {fecha:'2025-09-01', jugadorId:'P-1', asistio:true},
      {fecha:'2025-09-02', jugadorId:'P-2', asistio:false},
      {fecha:'2025-09-03', jugadorId:'P-3', asistio:true},
    ],
    calificaciones: [
      {fecha:'2025-09-05', jugadorId:'P-1', fisico:4, tecnico:4, tactico:3, psicologico:5},
      {fecha:'2025-09-06', jugadorId:'P-3', fisico:3, tecnico:3, tactico:3, psicologico:4},
    ],
    partidos: [
      {fecha:'2025-09-12', gf:2, gc:1},
      {fecha:'2025-09-19', gf:1, gc:1},
    ]
  };

  const filtroTipo = document.getElementById('filtroTipo');
  const contenedorSelect = document.getElementById('contenedorSelect');
  const filtroDesde = document.getElementById('filtroDesde');
  const filtroHasta = document.getElementById('filtroHasta');
  const kpis = document.getElementById('kpis');
  const tbody = document.querySelector('#tablaDetalle tbody');
  const btnExportar = document.getElementById('btnExportar');

  function parseDate(d){ return d ? new Date(d).getTime() : null; }
  function inRange(fecha, d1, d2){ const t = parseDate(fecha); if(d1 && t<d1) return false; if(d2 && t>d2) return false; return true; }
  function renderSelect(){
    const t = filtroTipo.value;
    if(t==='Individual'){
      contenedorSelect.innerHTML = `<label for="selJugador">Jugador</label><select id="selJugador">${jugadores.map(j=>`<option value="${j.id}">${j.nombre}</option>`).join('')}</select>`;
    } else {
      contenedorSelect.innerHTML = '';
    }
  }

  function compute(){
    const d1 = parseDate(filtroDesde.value); const d2 = parseDate(filtroHasta.value);
    const tipo = filtroTipo.value; const jugadorId = document.getElementById('selJugador')?.value;

    const asist = dataset.asistencias.filter(a=> inRange(a.fecha, d1, d2) && (tipo==='Individual'? a.jugadorId===jugadorId : true));
    const califs = dataset.calificaciones.filter(c=> inRange(c.fecha, d1, d2) && (tipo==='Individual'? c.jugadorId===jugadorId : true));
    const matchs = dataset.partidos.filter(p=> inRange(p.fecha, d1, d2));

    const totalAsis = asist.length; const pos = asist.filter(a=>a.asistio).length; const pct = totalAsis? Math.round(pos*100/totalAsis):0;
    const prom = califs.length? (califs.reduce((s,c)=> s + (c.fisico+c.tecnico+c.tactico+c.psicologico)/4, 0) / califs.length).toFixed(1) : '0.0';
    const pj = matchs.length; const gf = matchs.reduce((s,m)=>s+m.gf,0); const gc = matchs.reduce((s,m)=>s+m.gc,0);

    kpis.innerHTML = `
      <div class="kpi-card"><div class="kpi-title">% Asistencia</div><div class="kpi-value">${pct}%</div></div>
      <div class="kpi-card"><div class="kpi-title">Prom. Evaluación</div><div class="kpi-value">${prom}</div></div>
      <div class="kpi-card"><div class="kpi-title">PJ</div><div class="kpi-value">${pj}</div></div>
      <div class="kpi-card"><div class="kpi-title">GF / GC</div><div class="kpi-value">${gf} / ${gc}</div></div>
    `;

    const detalle = [
      {m:'Asistencias registradas', v: totalAsis},
      {m:'Asistencias positivas', v: pos},
      {m:'% Asistencia', v: `${pct}%`},
      {m:'Promedio evaluación', v: prom},
      {m:'Partidos jugados', v: pj},
      {m:'Goles a favor', v: gf},
      {m:'Goles en contra', v: gc},
    ];
    tbody.innerHTML = detalle.map(d=>`<tr><td>${d.m}</td><td>${d.v}</td></tr>`).join('');

    compute._last = {detalle};
  }

  function exportar(){ const detalle = compute._last?.detalle || []; const headers=[{label:'Métrica', value:r=>r.m},{label:'Valor', value:r=>r.v}]; const csv = toCSV(headers, detalle); download(`coach_reportes_${Date.now()}.csv`, csv, 'text/csv;charset=utf-8'); }

  filtroTipo.addEventListener('change', ()=>{ renderSelect(); compute(); });
  contenedorSelect.addEventListener('change', compute);
  [filtroDesde, filtroHasta].forEach(i=> i.addEventListener('change', compute));
  btnExportar.addEventListener('click', exportar);

  renderSelect(); compute();
})();
