(function(){
  const { toCSV, download } = window.AdminCommon;

  // Datos simulados (resumenes agregados)
  const equipos = [ {id:'E-1', nombre:'Leones A'}, {id:'E-2', nombre:'Leones B'} ];
  const jugadores = [ {id:'U-3', nombre:'Juan Lopez', equipoId:'E-1'}, {id:'U-4', nombre:'Andrés Gómez', equipoId:'E-1'}, {id:'U-5', nombre:'Pedro Ríos', equipoId:'E-2'} ];
  const entrenadores = [ {id:'U-10', nombre:'Marta Pérez'}, {id:'U-11', nombre:'Luis Soto'} ];

  // Eventos (en un sistema real se cruzaría con módulos; aquí números fijos de ejemplo)
  const dataset = {
    asistencia: [
      {fecha:'2025-09-01', equipoId:'E-1', jugadorId:'U-3', asistio:true},
      {fecha:'2025-09-02', equipoId:'E-1', jugadorId:'U-4', asistio:false},
      {fecha:'2025-09-03', equipoId:'E-2', jugadorId:'U-5', asistio:true},
    ],
    evaluaciones: [
      {fecha:'2025-09-01', jugadorId:'U-3', fisico:4, tecnico:3, tactico:4, psicologico:5},
      {fecha:'2025-09-03', jugadorId:'U-5', fisico:3, tecnico:3, tactico:3, psicologico:4},
    ],
    partidos: [
      {fecha:'2025-09-10', equipoId:'E-1', goles:3, recibidos:1, resultado:'G'},
      {fecha:'2025-09-15', equipoId:'E-1', goles:2, recibidos:2, resultado:'E'},
      {fecha:'2025-09-12', equipoId:'E-2', goles:1, recibidos:2, resultado:'P'},
    ],
    pagos: [
      {fecha:'2025-09-05', monto:80000, estado:'Pagado', periodo:'2025-09'},
      {fecha:'2025-09-07', monto:120000, estado:'Pendiente', periodo:'2025-09'},
      {fecha:'2025-08-25', monto:80000, estado:'Pagado', periodo:'2025-08'},
    ]
  };

  // Elementos
  const filtroDesde = document.getElementById('filtroDesde');
  const filtroHasta = document.getElementById('filtroHasta');
  const filtroEntidad = document.getElementById('filtroEntidad');
  const contenedorSelectEntidad = document.getElementById('contenedorSelectEntidad');
  const kpis = document.getElementById('kpis');
  const tbodyEstadisticas = document.querySelector('#tablaEstadisticas tbody');
  const btnExportarReportes = document.getElementById('btnExportarReportes');

  function parseDate(d){ return d ? new Date(d).getTime() : null; }
  function inRange(fecha, d1, d2){ const t = parseDate(fecha); if(d1 && t<d1) return false; if(d2 && t>d2) return false; return true; }

  function renderEntidadSelect(){
    const type = filtroEntidad.value;
    let html = '';
    if(type==='Equipo'){
      html = `<label for="entidadEquipo">Equipo</label><select id="entidadEquipo">${equipos.map(e=>`<option value="${e.id}">${e.nombre}</option>`).join('')}</select>`;
    } else if(type==='Jugador'){
      html = `<label for="entidadJugador">Jugador</label><select id="entidadJugador">${jugadores.map(j=>`<option value="${j.id}">${j.nombre}</option>`).join('')}</select>`;
    } else if(type==='Entrenador'){
      html = `<label for="entidadEntrenador">Entrenador</label><select id="entidadEntrenador">${entrenadores.map(e=>`<option value="${e.id}">${e.nombre}</option>`).join('')}</select>`;
    }
    contenedorSelectEntidad.innerHTML = html;
  }

  function computeStats(){
    const d1 = parseDate(filtroDesde.value); const d2 = parseDate(filtroHasta.value);
    const type = filtroEntidad.value;
    const entityId = document.querySelector('#contenedorSelectEntidad select')?.value;

    const asis = dataset.asistencia.filter(a=> inRange(a.fecha, d1, d2));
    const evals = dataset.evaluaciones.filter(e=> inRange(e.fecha, d1, d2));
    const matchs = dataset.partidos.filter(p=> inRange(p.fecha, d1, d2));
    const pagos = dataset.pagos.filter(p=> inRange(p.fecha, d1, d2));

    // Filtros por entidad básica
    let filterBy = ()=>true;
    if(type==='Equipo') filterBy = (x)=> x.equipoId===entityId;
    if(type==='Jugador') filterBy = (x)=> x.jugadorId===entityId;
    // Entrenador no tiene datos directos en dataset (placeholder)

    const asis2 = asis.filter(filterBy);
    const evals2 = evals.filter(filterBy);
    const matchs2 = matchs.filter(m => type==='Equipo'? filterBy(m): true);

    // KPIs
    const totalAsistencias = asis2.length;
    const asistenciaPositiva = asis2.filter(a=>a.asistio).length;
    const pctAsistencia = totalAsistencias? Math.round(asistenciaPositiva*100/totalAsistencias) : 0;

    const promEval = evals2.length? (evals2.reduce((s,e)=> s + (e.fisico+e.tecnico+e.tactico+e.psicologico)/4, 0) / evals2.length).toFixed(1) : '0.0';

    const pj = matchs2.length;
    const g = matchs2.filter(m=>m.resultado==='G').length;
    const e = matchs2.filter(m=>m.resultado==='E').length;
    const p = matchs2.filter(m=>m.resultado==='P').length;
    const gf = matchs2.reduce((s,m)=> s+m.goles,0);
    const gc = matchs2.reduce((s,m)=> s+m.recibidos,0);
    const pts = g*3 + e*1;

    const ingresos = pagos.filter(p=>p.estado==='Pagado').reduce((s,i)=> s+i.monto,0);
    const pendiente = pagos.filter(p=>p.estado==='Pendiente').reduce((s,i)=> s+i.monto,0);

    // Render KPIs
    kpis.innerHTML = `
      <div class="kpi-card"><div class="kpi-title">% Asistencia</div><div class="kpi-value">${pctAsistencia}%</div></div>
      <div class="kpi-card"><div class="kpi-title">Prom. Evaluación</div><div class="kpi-value">${promEval}</div></div>
      <div class="kpi-card"><div class="kpi-title">PJ / G-E-P</div><div class="kpi-value">${pj} / ${g}-${e}-${p}</div></div>
      <div class="kpi-card"><div class="kpi-title">GF / GC</div><div class="kpi-value">${gf} / ${gc}</div></div>
      <div class="kpi-card"><div class="kpi-title">Pts</div><div class="kpi-value">${pts}</div></div>
      <div class="kpi-card"><div class="kpi-title">Ingresos</div><div class="kpi-value">$${ingresos.toLocaleString('es-CO')}</div></div>
      <div class="kpi-card"><div class="kpi-title">Pendiente</div><div class="kpi-value">$${pendiente.toLocaleString('es-CO')}</div></div>
    `;

    // Tabla detallada
    const detalles = [
      {m:'Asistencias registradas', v: totalAsistencias},
      {m:'Asistencias positivas', v: asistenciaPositiva},
      {m:'% Asistencia', v: `${pctAsistencia}%`},
      {m:'Promedio evaluación', v: promEval},
      {m:'Partidos jugados', v: pj},
      {m:'Ganados', v: g},
      {m:'Empatados', v: e},
      {m:'Perdidos', v: p},
      {m:'Goles a favor', v: gf},
      {m:'Goles en contra', v: gc},
      {m:'Puntos', v: pts},
      {m:'Ingresos', v: `$${ingresos.toLocaleString('es-CO')}`},
      {m:'Pendiente', v: `$${pendiente.toLocaleString('es-CO')}`},
    ];
    tbodyEstadisticas.innerHTML = detalles.map(d=>`<tr><td>${d.m}</td><td>${d.v}</td></tr>`).join('');

    // Para exportar
    computeStats._last = {detalles};
  }

  function exportar(){
    const detalles = computeStats._last?.detalles || [];
    const headers = [ {label:'Métrica', value:r=>r.m}, {label:'Valor', value:r=>r.v} ];
    const csv = toCSV(headers, detalles);
    download(`reportes_${Date.now()}.csv`, csv, 'text/csv;charset=utf-8');
  }

  // Eventos
  filtroEntidad.addEventListener('change', ()=>{ renderEntidadSelect(); computeStats(); });
  [filtroDesde, filtroHasta].forEach(i=> i.addEventListener('change', computeStats));
  contenedorSelectEntidad.addEventListener('change', computeStats);
  btnExportarReportes.addEventListener('click', exportar);

  // Init
  renderEntidadSelect(); computeStats();
})();
