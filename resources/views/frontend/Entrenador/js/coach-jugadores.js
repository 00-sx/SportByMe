(function(){
  const { GlobalStore, openModal, closeModal, clearErrors, setError, confirmDialog } = window.AdminCommon;

  // Datos simulados del equipo del entrenador
  const jugadores = [
    {id:'P-1', nombre:'Juan López', edad:12, posicion:'Delantero', categoria:'Sub-12'},
    {id:'P-2', nombre:'Andrés Gómez', edad:11, posicion:'Mediocampo', categoria:'Sub-12'},
    {id:'P-3', nombre:'Pedro Ríos', edad:15, posicion:'Defensa', categoria:'Sub-16'},
  ];

  let observaciones = [
    {id:'O-1', jugadorId:'P-1', fecha:'2025-09-05', tipo:'Técnica', detalle:'Mejorar control orientado'},
  ];

  let calificaciones = [
    {id:'CAL-1', jugadorId:'P-1', fecha:'2025-09-06', fisico:4, tecnico:4, tactico:3, psicologico:5},
  ];

  // Elementos
  const filtroJugador = document.getElementById('filtroJugador');
  const perfilJugador = document.getElementById('perfilJugador');
  const tbodyObs = document.querySelector('#tablaObs tbody');
  const tbodyCalif = document.querySelector('#tablaCalif tbody');

  const btnNuevaObs = document.getElementById('btnNuevaObs');
  const btnNuevaCalif = document.getElementById('btnNuevaCalif');

  // Modal observación
  const modalObs = document.getElementById('modalObs');
  const formObs = document.getElementById('formObs');
  const obsId = document.getElementById('obsId');
  const tipoObs = document.getElementById('tipoObs');
  const detalleObs = document.getElementById('detalleObs');
  const cerrarModalObs = document.getElementById('cerrarModalObs');
  const cancelarObs = document.getElementById('btnCancelarObs');

  // Modal calificación
  const modalCalif = document.getElementById('modalCalif');
  const formCalif = document.getElementById('formCalif');
  const califId = document.getElementById('califId');
  const fechaCalif = document.getElementById('fechaCalif');
  const fisico = document.getElementById('fisico');
  const tecnico = document.getElementById('tecnico');
  const tactico = document.getElementById('tactico');
  const psicologico = document.getElementById('psicologico');
  const cerrarModalCalif = document.getElementById('cerrarModalCalif');
  const cancelarCalif = document.getElementById('btnCancelarCalif');

  function renderJugadores(){
    filtroJugador.innerHTML = jugadores.map(j=>`<option value="${j.id}">${j.nombre} - ${j.categoria}</option>`).join('');
  }

  function jugadorActual(){ return jugadores.find(j=>j.id===filtroJugador.value) || jugadores[0]; }

  function renderPerfil(){
    const j = jugadorActual(); if(!j) { perfilJugador.innerHTML=''; return; }
    perfilJugador.innerHTML = `
      <div><strong>Nombre:</strong> ${j.nombre}</div>
      <div><strong>Edad:</strong> ${j.edad}</div>
      <div><strong>Posición:</strong> ${j.posicion}</div>
      <div><strong>Categoría:</strong> ${j.categoria}</div>
    `;
  }

  function renderObs(){
    const id = jugadorActual()?.id;
    const data = observaciones.filter(o=>o.jugadorId===id);
    tbodyObs.innerHTML = data.map(o=>`
      <tr>
        <td>${o.fecha}</td>
        <td>${o.tipo}</td>
        <td>${o.detalle}</td>
        <td>
          <button class="btn" data-action="edit-obs" data-id="${o.id}">Editar</button>
          <button class="btn danger" data-action="del-obs" data-id="${o.id}">Eliminar</button>
        </td>
      </tr>
    `).join('');
  }

  function renderCalif(){
    const id = jugadorActual()?.id;
    const data = calificaciones.filter(c=>c.jugadorId===id);
    tbodyCalif.innerHTML = data.map(c=>{
      const prom = ((c.fisico + c.tecnico + c.tactico + c.psicologico)/4).toFixed(1);
      return `
      <tr>
        <td>${c.fecha}</td>
        <td>${c.fisico}</td>
        <td>${c.tecnico}</td>
        <td>${c.tactico}</td>
        <td>${c.psicologico}</td>
        <td>${prom}</td>
        <td>
          <button class="btn" data-action="edit-cal" data-id="${c.id}">Editar</button>
          <button class="btn danger" data-action="del-cal" data-id="${c.id}">Eliminar</button>
        </td>
      </tr>`;
    }).join('');
  }

  function resetObsForm(){ formObs.reset(); obsId.value=''; clearErrors(formObs); }
  function resetCalifForm(){ formCalif.reset(); califId.value=''; clearErrors(formCalif); }

  function openCreateObs(){ resetObsForm(); openModal(modalObs); }
  function openEditObs(id){ const o = observaciones.find(x=>x.id===id); if(!o) return; resetObsForm(); obsId.value=o.id; tipoObs.value=o.tipo; detalleObs.value=o.detalle; openModal(modalObs); }
  function submitObs(e){ e.preventDefault(); if(!detalleObs.value.trim()){ setError(formObs,'detalleObs','Campo requerido'); return; } const payload={ id: obsId.value||GlobalStore.nextId('O'), jugadorId: jugadorActual()?.id, fecha: new Date().toISOString().slice(0,10), tipo: tipoObs.value, detalle: detalleObs.value.trim() }; if(obsId.value){ const idx = observaciones.findIndex(x=>x.id===obsId.value); if(idx>-1) observaciones[idx]={...observaciones[idx], ...payload}; } else { observaciones.push(payload); } closeModal(modalObs); renderObs(); }

  function openCreateCalif(){ resetCalifForm(); openModal(modalCalif); }
  function openEditCalif(id){ const c = calificaciones.find(x=>x.id===id); if(!c) return; resetCalifForm(); califId.value=c.id; fechaCalif.value=c.fecha; fisico.value=c.fisico; tecnico.value=c.tecnico; tactico.value=c.tactico; psicologico.value=c.psicologico; openModal(modalCalif); }
  function validateCalif(){ clearErrors(formCalif); let ok=true; if(!fechaCalif.value){ setError(formCalif,'fechaCalif','Campo requerido'); ok=false; } return ok; }
  function submitCalif(e){ e.preventDefault(); if(!validateCalif()) return; const payload={ id: califId.value||GlobalStore.nextId('CAL'), jugadorId: jugadorActual()?.id, fecha: fechaCalif.value, fisico:Number(fisico.value), tecnico:Number(tecnico.value), tactico:Number(tactico.value), psicologico:Number(psicologico.value) }; if(califId.value){ const idx = calificaciones.findIndex(x=>x.id===califId.value); if(idx>-1) calificaciones[idx]={...calificaciones[idx], ...payload}; } else { calificaciones.push(payload); } closeModal(modalCalif); renderCalif(); }

  function deleteObs(id){ observaciones = observaciones.filter(o=>o.id!==id); renderObs(); }
  function deleteCalif(id){ calificaciones = calificaciones.filter(c=>c.id!==id); renderCalif(); }

  // Eventos
  btnNuevaObs.addEventListener('click', openCreateObs);
  btnNuevaCalif.addEventListener('click', openCreateCalif);
  filtroJugador.addEventListener('change', ()=>{ renderPerfil(); renderObs(); renderCalif(); });

  cerrarModalObs.addEventListener('click', ()=> closeModal(modalObs));
  cancelarObs.addEventListener('click', ()=> closeModal(modalObs));
  formObs.addEventListener('submit', submitObs);

  cerrarModalCalif.addEventListener('click', ()=> closeModal(modalCalif));
  cancelarCalif.addEventListener('click', ()=> closeModal(modalCalif));
  formCalif.addEventListener('submit', submitCalif);

  // Init
  renderJugadores(); renderPerfil(); renderObs(); renderCalif();
})();
