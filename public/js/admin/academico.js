(function(){
  const { GlobalStore, openModal, closeModal, clearErrors, setError, confirmDialog } = window.AdminCommon;

  // Datos simulados
  const equipos = [
    {id:'E-1', nombre:'Leones A', jugadores:[{id:'U-3', nombre:'Juan Lopez'}, {id:'U-4', nombre:'Andrés Gómez'}]},
    {id:'E-2', nombre:'Leones B', jugadores:[{id:'U-5', nombre:'Pedro Ríos'}]},
  ];

  let asistencias = [
    {id:'A-1', fecha:'2025-09-11', equipoId:'E-1', jugadorId:'U-3', jugador:'Juan Lopez', asistio:true},
  ];

  let evaluaciones = [
    {id:'EV-1', fecha:'2025-09-05', equipoId:'E-1', jugadorId:'U-3', jugador:'Juan Lopez', fisico:4, tecnico:3, tactico:4, psicologico:5},
  ];

  // Elementos
  const filtroEquipoAsis = document.getElementById('filtroEquipoAsis');
  const filtroFechaAsis = document.getElementById('filtroFechaAsis');
  const tbodyAsistencia = document.querySelector('#tablaAsistencia tbody');

  const filtroEquipoEval = document.getElementById('filtroEquipoEval');
  const filtroJugadorEval = document.getElementById('filtroJugadorEval');
  const tbodyEvaluaciones = document.querySelector('#tablaEvaluaciones tbody');

  const btnNuevaAsistencia = document.getElementById('btnNuevaAsistencia');
  const btnNuevaEvaluacion = document.getElementById('btnNuevaEvaluacion');

  // Modales asistencia
  const modalAsistencia = document.getElementById('modalAsistencia');
  const formAsistencia = document.getElementById('formAsistencia');
  const cerrarModalAsistencia = document.getElementById('cerrarModalAsistencia');
  const cancelarAsistencia = document.getElementById('btnCancelarAsistencia');
  const asistenciaId = document.getElementById('asistenciaId');
  const fechaAsistencia = document.getElementById('fechaAsistencia');
  const equipoAsistencia = document.getElementById('equipoAsistencia');
  const jugadorAsistencia = document.getElementById('jugadorAsistencia');
  const asistio = document.getElementById('asistio');

  // Modales evaluación
  const modalEvaluacion = document.getElementById('modalEvaluacion');
  const formEvaluacion = document.getElementById('formEvaluacion');
  const cerrarModalEvaluacion = document.getElementById('cerrarModalEvaluacion');
  const cancelarEvaluacion = document.getElementById('btnCancelarEvaluacion');
  const evaluacionId = document.getElementById('evaluacionId');
  const fechaEvaluacion = document.getElementById('fechaEvaluacion');
  const equipoEvaluacion = document.getElementById('equipoEvaluacion');
  const jugadorEvaluacion = document.getElementById('jugadorEvaluacion');
  const fisico = document.getElementById('fisico');
  const tecnico = document.getElementById('tecnico');
  const tactico = document.getElementById('tactico');
  const psicologico = document.getElementById('psicologico');

  function fillEquipos(){
    const opts = equipos.map(e=>`<option value="${e.id}">${e.nombre}</option>`).join('');
    filtroEquipoAsis.innerHTML = '<option value="">Todos</option>' + opts;
    filtroEquipoEval.innerHTML = '<option value="">Todos</option>' + opts;
    equipoAsistencia.innerHTML = opts;
    equipoEvaluacion.innerHTML = opts;
    onChangeEquipoAsistencia();
    onChangeEquipoEvaluacion();
  }

  function onChangeEquipoAsistencia(){
    const eq = equipos.find(e=>e.id===equipoAsistencia.value) || equipos[0];
    if(!eq) { jugadorAsistencia.innerHTML=''; return; }
    jugadorAsistencia.innerHTML = eq.jugadores.map(j=>`<option value="${j.id}">${j.nombre}</option>`).join('');
  }
  function onChangeEquipoEvaluacion(){
    const eq = equipos.find(e=>e.id===equipoEvaluacion.value) || equipos[0];
    if(!eq) { jugadorEvaluacion.innerHTML=''; return; }
    const opts = eq.jugadores.map(j=>`<option value="${j.id}">${j.nombre}</option>`).join('');
    jugadorEvaluacion.innerHTML = opts;
    filtroJugadorEval.innerHTML = '<option value="">Todos</option>' + opts;
  }

  function renderAsistencia(){
    const eq = filtroEquipoAsis.value; const f = filtroFechaAsis.value;
    const data = asistencias.filter(a=>{ if(eq && a.equipoId!==eq) return false; if(f && a.fecha!==f) return false; return true; });
    tbodyAsistencia.innerHTML = data.map(a=>`
      <tr>
        <td>${a.fecha}</td>
        <td>${equipos.find(e=>e.id===a.equipoId)?.nombre || '-'}</td>
        <td>${a.jugador}</td>
        <td>${a.asistio?'<span class="badge success">Si</span>':'<span class="badge warning">No</span>'}</td>
        <td>
          <button class="btn" data-action="edit-asist" data-id="${a.id}">Editar</button>
          <button class="btn danger" data-action="del-asist" data-id="${a.id}">Eliminar</button>
        </td>
      </tr>
    `).join('');
  }

  function renderEvaluaciones(){
    const eq = filtroEquipoEval.value; const ju = filtroJugadorEval.value;
    const data = evaluaciones.filter(ev=>{ if(eq && ev.equipoId!==eq) return false; if(ju && ev.jugadorId!==ju) return false; return true; });
    tbodyEvaluaciones.innerHTML = data.map(ev=>{
      const prom = ((ev.fisico + ev.tecnico + ev.tactico + ev.psicologico)/4).toFixed(1);
      return `<tr>
        <td>${ev.fecha}</td>
        <td>${equipos.find(e=>e.id===ev.equipoId)?.nombre || '-'}</td>
        <td>${ev.jugador}</td>
        <td>${ev.fisico}</td>
        <td>${ev.tecnico}</td>
        <td>${ev.tactico}</td>
        <td>${ev.psicologico}</td>
        <td>${prom}</td>
        <td>
          <button class="btn" data-action="edit-eval" data-id="${ev.id}">Editar</button>
          <button class="btn danger" data-action="del-eval" data-id="${ev.id}">Eliminar</button>
        </td>
      </tr>`
    }).join('');
  }

  function resetAsistenciaForm(){ formAsistencia.reset(); asistenciaId.value=''; clearErrors(formAsistencia); }
  function resetEvaluacionForm(){ formEvaluacion.reset(); evaluacionId.value=''; clearErrors(formEvaluacion); }

  function openCreateAsistencia(){ resetAsistenciaForm(); openModal(modalAsistencia); }
  function openEditAsistencia(id){ const a = asistencias.find(x=>x.id===id); if(!a) return; resetAsistenciaForm(); asistenciaId.value=a.id; fechaAsistencia.value=a.fecha; equipoAsistencia.value=a.equipoId; onChangeEquipoAsistencia(); jugadorAsistencia.value=a.jugadorId; asistio.value=a.asistio?'Si':'No'; openModal(modalAsistencia); }

  function validateAsistencia(){ clearErrors(formAsistencia); let ok=true; const req=[['fechaAsistencia',fechaAsistencia.value],['equipoAsistencia',equipoAsistencia.value],['jugadorAsistencia',jugadorAsistencia.value]]; req.forEach(([id,val])=>{ if(!val){ setError(formAsistencia,id,'Campo requerido'); ok=false; } }); return ok; }
  function submitAsistencia(e){ e.preventDefault(); if(!validateAsistencia()) return; const jug = (equipos.find(e=>e.id===equipoAsistencia.value)?.jugadores||[]).find(j=>j.id===jugadorAsistencia.value); const payload={ id: asistenciaId.value||GlobalStore.nextId('A'), fecha:fechaAsistencia.value, equipoId:equipoAsistencia.value, jugadorId:jugadorAsistencia.value, jugador: jug?.nombre||'', asistio: asistio.value==='Si' }; if(asistenciaId.value){ const idx = asistencias.findIndex(x=>x.id===asistenciaId.value); if(idx>-1) asistencias[idx]={...asistencias[idx],...payload}; } else { asistencias.push(payload); } closeModal(modalAsistencia); renderAsistencia(); }

  function openCreateEvaluacion(){ resetEvaluacionForm(); openModal(modalEvaluacion); }
  function openEditEvaluacion(id){ const ev = evaluaciones.find(x=>x.id===id); if(!ev) return; resetEvaluacionForm(); evaluacionId.value=ev.id; fechaEvaluacion.value=ev.fecha; equipoEvaluacion.value=ev.equipoId; onChangeEquipoEvaluacion(); jugadorEvaluacion.value=ev.jugadorId; fisico.value=ev.fisico; tecnico.value=ev.tecnico; tactico.value=ev.tactico; psicologico.value=ev.psicologico; openModal(modalEvaluacion); }

  function validateEvaluacion(){ clearErrors(formEvaluacion); let ok=true; const req=[['fechaEvaluacion',fechaEvaluacion.value],['equipoEvaluacion',equipoEvaluacion.value],['jugadorEvaluacion',jugadorEvaluacion.value]]; req.forEach(([id,val])=>{ if(!val){ setError(formEvaluacion,id,'Campo requerido'); ok=false; } }); return ok; }
  function submitEvaluacion(e){ e.preventDefault(); if(!validateEvaluacion()) return; const jug = (equipos.find(e=>e.id===equipoEvaluacion.value)?.jugadores||[]).find(j=>j.id===jugadorEvaluacion.value); const payload={ id: evaluacionId.value||GlobalStore.nextId('EV'), fecha:fechaEvaluacion.value, equipoId:equipoEvaluacion.value, jugadorId:jugadorEvaluacion.value, jugador:jug?.nombre||'', fisico:Number(fisico.value||0), tecnico:Number(tecnico.value||0), tactico:Number(tactico.value||0), psicologico:Number(psicologico.value||0) }; if(evaluacionId.value){ const idx = evaluaciones.findIndex(x=>x.id===evaluacionId.value); if(idx>-1) evaluaciones[idx]={...evaluaciones[idx],...payload}; } else { evaluaciones.push(payload); } closeModal(modalEvaluacion); renderEvaluaciones(); }

  function deleteAsistencia(id){ asistencias = asistencias.filter(a=>a.id!==id); renderAsistencia(); }
  function deleteEvaluacion(id){ evaluaciones = evaluaciones.filter(e=>e.id!==id); renderEvaluaciones(); }

  // Eventos
  btnNuevaAsistencia.addEventListener('click', openCreateAsistencia);
  btnNuevaEvaluacion.addEventListener('click', openCreateEvaluacion);
  filtroEquipoAsis.addEventListener('change', renderAsistencia);
  filtroFechaAsis.addEventListener('change', renderAsistencia);

  filtroEquipoEval.addEventListener('change', ()=>{ onChangeEquipoEvaluacion(); renderEvaluaciones(); });
  filtroJugadorEval.addEventListener('change', renderEvaluaciones);

  cerrarModalAsistencia.addEventListener('click', ()=> closeModal(modalAsistencia));
  cancelarAsistencia.addEventListener('click', ()=> closeModal(modalAsistencia));
  formAsistencia.addEventListener('submit', submitAsistencia);
  equipoAsistencia.addEventListener('change', onChangeEquipoAsistencia);

  cerrarModalEvaluacion.addEventListener('click', ()=> closeModal(modalEvaluacion));
  cancelarEvaluacion.addEventListener('click', ()=> closeModal(modalEvaluacion));
  formEvaluacion.addEventListener('submit', submitEvaluacion);
  equipoEvaluacion.addEventListener('change', onChangeEquipoEvaluacion);

  tbodyAsistencia.addEventListener('click', (e)=>{
    const btn = e.target.closest('button[data-action]'); if(!btn) return; const id=btn.dataset.id; const a=btn.dataset.action;
    if(a==='edit-asist') openEditAsistencia(id);
    if(a==='del-asist') confirmDialog({title:'Eliminar asistencia', message:'¿Eliminar el registro?', onAccept:()=> deleteAsistencia(id)});
  });
  tbodyEvaluaciones.addEventListener('click', (e)=>{
    const btn = e.target.closest('button[data-action]'); if(!btn) return; const id=btn.dataset.id; const a=btn.dataset.action;
    if(a==='edit-eval') openEditEvaluacion(id);
    if(a==='del-eval') confirmDialog({title:'Eliminar evaluación', message:'¿Eliminar el registro?', onAccept:()=> deleteEvaluacion(id)});
  });

  // Init
  fillEquipos(); renderAsistencia(); renderEvaluaciones();
})();
