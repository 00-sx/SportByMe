(function(){
  const { GlobalStore, openModal, closeModal, clearErrors, setError, confirmDialog } = window.AdminCommon;

  // Datos simulados
  let plantillas = [
    {id:'P-1', nombre:'Resistencia Aeróbica', objetivo:'Fondo', duracion:60, carga:'Media'},
    {id:'P-2', nombre:'Velocidad y Agilidad', objetivo:'Sprint y coordinación', duracion:45, carga:'Alta'},
  ];

  let canchas = [
    {id:'CH-1', nombre:'Cancha Norte', ubicacion:'Sede A'},
    {id:'CH-2', nombre:'Cancha Sur', ubicacion:'Sede B'},
  ];

  let equipos = [
    {id:'E-1', nombre:'Leones A'},
    {id:'E-2', nombre:'Leones B'},
  ];

  let horarios = [
    {id:'H-1', equipoId:'E-1', canchaId:'CH-1', fecha:'2025-09-10', inicio:'17:00', fin:'18:30', plantillaId:'P-1'},
  ];

  // Elementos
  const tbodyPlantillas = document.querySelector('#tablaPlantillas tbody');
  const tbodyHorarios = document.querySelector('#tablaHorarios tbody');
  const tbodyCanchas = document.querySelector('#tablaCanchas tbody');

  const buscarPlantilla = document.getElementById('buscarPlantilla');
  const filtroEquipo = document.getElementById('filtroEquipo');
  const filtroCancha = document.getElementById('filtroCancha');
  const filtroFecha = document.getElementById('filtroFecha');

  // Botones
  const btnNuevaPlantilla = document.getElementById('btnNuevaPlantilla');
  const btnNuevoHorario = document.getElementById('btnNuevoHorario');
  const btnNuevaCancha = document.getElementById('btnNuevaCancha');

  // Modales Plantilla
  const modalPlantilla = document.getElementById('modalPlantilla');
  const formPlantilla = document.getElementById('formPlantilla');
  const tituloPlantilla = document.getElementById('modalPlantillaTitulo');
  const cerrarModalPlantilla = document.getElementById('cerrarModalPlantilla');
  const cancelarPlantilla = document.getElementById('btnCancelarPlantilla');
  const plantillaId = document.getElementById('plantillaId');
  const nombrePlantilla = document.getElementById('nombrePlantilla');
  const objetivoPlantilla = document.getElementById('objetivoPlantilla');
  const duracionPlantilla = document.getElementById('duracionPlantilla');
  const cargaPlantilla = document.getElementById('cargaPlantilla');

  // Modales Horario
  const modalHorario = document.getElementById('modalHorario');
  const formHorario = document.getElementById('formHorario');
  const tituloHorario = document.getElementById('modalHorarioTitulo');
  const cerrarModalHorario = document.getElementById('cerrarModalHorario');
  const cancelarHorario = document.getElementById('btnCancelarHorario');
  const horarioId = document.getElementById('horarioId');
  const equipoHorario = document.getElementById('equipoHorario');
  const canchaHorario = document.getElementById('canchaHorario');
  const fechaHorario = document.getElementById('fechaHorario');
  const inicioHorario = document.getElementById('inicioHorario');
  const finHorario = document.getElementById('finHorario');
  const plantillaHorario = document.getElementById('plantillaHorario');

  // Modales Cancha
  const modalCancha = document.getElementById('modalCancha');
  const formCancha = document.getElementById('formCancha');
  const tituloCancha = document.getElementById('modalCanchaTitulo');
  const cerrarModalCancha = document.getElementById('cerrarModalCancha');
  const cancelarCancha = document.getElementById('btnCancelarCancha');
  const canchaId = document.getElementById('canchaId');
  const nombreCancha = document.getElementById('nombreCancha');
  const ubicacionCancha = document.getElementById('ubicacionCancha');

  function renderPlantillas(){
    const q = (buscarPlantilla.value||'').trim().toLowerCase();
    const data = plantillas.filter(p => !q || `${p.nombre} ${p.objetivo}`.toLowerCase().includes(q));
    tbodyPlantillas.innerHTML = data.map(p=>`
      <tr>
        <td>${p.nombre}</td>
        <td>${p.objetivo||'-'}</td>
        <td>${p.duracion||'-'}</td>
        <td>${p.carga||'-'}</td>
        <td>
          <button class="btn" data-action="edit-template" data-id="${p.id}">Editar</button>
          <button class="btn danger" data-action="del-template" data-id="${p.id}">Eliminar</button>
        </td>
      </tr>
    `).join('');

    plantillaHorario.innerHTML = '<option value="">-</option>' + plantillas.map(p=>`<option value="${p.id}">${p.nombre}</option>`).join('');
  }

  function renderCanchas(){
    tbodyCanchas.innerHTML = canchas.map(c=>`
      <tr>
        <td>${c.nombre}</td>
        <td>${c.ubicacion||'-'}</td>
        <td>
          <button class="btn" data-action="edit-field" data-id="${c.id}">Editar</button>
          <button class="btn danger" data-action="del-field" data-id="${c.id}">Eliminar</button>
        </td>
      </tr>
    `).join('');

    filtroCancha.innerHTML = '<option value="">Todas</option>' + canchas.map(c=>`<option value="${c.id}">${c.nombre}</option>`).join('');
    canchaHorario.innerHTML = canchas.map(c=>`<option value="${c.id}">${c.nombre}</option>`).join('');
  }

  function renderEquipos(){
    const opts = equipos.map(e=>`<option value="${e.id}">${e.nombre}</option>`).join('');
    filtroEquipo.innerHTML = '<option value="">Todos</option>' + opts;
    equipoHorario.innerHTML = opts;
  }

  function collide(aStart, aEnd, bStart, bEnd){
    return aStart < bEnd && bStart < aEnd; // overlapped
  }

  function renderHorarios(){
    const eq = filtroEquipo.value; const ch = filtroCancha.value; const f = filtroFecha.value;

    const data = horarios.filter(h=>{
      if(eq && h.equipoId !== eq) return false;
      if(ch && h.canchaId !== ch) return false;
      if(f && h.fecha !== f) return false;
      return true;
    });

    tbodyHorarios.innerHTML = data.map(h=>{
      const equipo = equipos.find(e=>e.id===h.equipoId)?.nombre || '-';
      const cancha = canchas.find(c=>c.id===h.canchaId)?.nombre || '-';
      const plantilla = plantillas.find(p=>p.id===h.plantillaId)?.nombre || '-';
      return `<tr>
        <td>${h.fecha}</td>
        <td>${h.inicio}</td>
        <td>${h.fin}</td>
        <td>${equipo}</td>
        <td>${cancha}</td>
        <td>${plantilla}</td>
        <td>
          <button class="btn" data-action="edit-time" data-id="${h.id}">Editar</button>
          <button class="btn danger" data-action="del-time" data-id="${h.id}">Eliminar</button>
        </td>
      </tr>`
    }).join('');
  }

  function resetTemplateForm(){ formPlantilla.reset(); plantillaId.value=''; clearErrors(formPlantilla); }
  function resetHorarioForm(){ formHorario.reset(); horarioId.value=''; clearErrors(formHorario); }
  function resetCanchaForm(){ formCancha.reset(); canchaId.value=''; clearErrors(formCancha); }

  function openCreatePlantilla(){ resetTemplateForm(); tituloPlantilla.textContent='Nueva Plantilla'; openModal(modalPlantilla); }
  function openEditPlantilla(id){
    const p = plantillas.find(x=>x.id===id); if(!p) return;
    resetTemplateForm();
    plantillaId.value = p.id; nombrePlantilla.value=p.nombre; objetivoPlantilla.value=p.objetivo||''; duracionPlantilla.value=p.duracion||''; cargaPlantilla.value=p.carga||'Media';
    tituloPlantilla.textContent='Editar Plantilla'; openModal(modalPlantilla);
  }

  function validatePlantilla(){
    clearErrors(formPlantilla); let ok = true;
    if(!nombrePlantilla.value.trim()){ setError(formPlantilla,'nombrePlantilla','Campo requerido'); ok=false; }
    if(duracionPlantilla.value && Number(duracionPlantilla.value) < 10){ setError(formPlantilla,'duracionPlantilla','Mínimo 10'); ok=false; }
    return ok;
  }

  function submitPlantilla(e){
    e.preventDefault(); if(!validatePlantilla()) return;
    const payload = {
      id: plantillaId.value || GlobalStore.nextId('P'),
      nombre: nombrePlantilla.value.trim(),
      objetivo: objetivoPlantilla.value.trim(),
      duracion: duracionPlantilla.value ? Number(duracionPlantilla.value) : undefined,
      carga: cargaPlantilla.value || 'Media',
    };
    if(plantillaId.value){
      const idx = plantillas.findIndex(x=>x.id===plantillaId.value); if(idx>-1) plantillas[idx] = {...plantillas[idx], ...payload};
    } else {
      plantillas.push(payload);
    }
    closeModal(modalPlantilla); renderPlantillas();
  }

  function openCreateHorario(){
    resetHorarioForm(); tituloHorario.textContent='Nuevo Horario';
    if(!equipos.length || !canchas.length){ alert('Debe existir al menos un equipo y una cancha.'); return; }
    renderEquipos(); renderCanchas(); renderPlantillas();
    openModal(modalHorario);
  }
  function openEditHorario(id){
    const h = horarios.find(x=>x.id===id); if(!h) return;
    resetHorarioForm(); tituloHorario.textContent='Editar Horario';
    renderEquipos(); renderCanchas(); renderPlantillas();
    horarioId.value = h.id; equipoHorario.value = h.equipoId; canchaHorario.value = h.canchaId; fechaHorario.value = h.fecha; inicioHorario.value=h.inicio; finHorario.value=h.fin; plantillaHorario.value=h.plantillaId||'';
    openModal(modalHorario);
  }

  function timeToMin(t){ const [h,m] = t.split(':').map(Number); return h*60+m; }
  function validateHorario(){
    clearErrors(formHorario); let ok = true;
    const req = [ ['equipoHorario',equipoHorario.value], ['canchaHorario',canchaHorario.value], ['fechaHorario',fechaHorario.value], ['inicioHorario',inicioHorario.value], ['finHorario',finHorario.value] ];
    req.forEach(([id,val])=>{ if(!val){ setError(formHorario,id,'Campo requerido'); ok=false; } });
    if(inicioHorario.value && finHorario.value){
      if(timeToMin(finHorario.value) <= timeToMin(inicioHorario.value)){ setError(formHorario,'finHorario','Debe ser mayor a inicio'); ok=false; }
    }

    // Validar solapes por cancha y fecha
    if(ok){
      const currentId = horarioId.value;
      const f = fechaHorario.value; const ch = canchaHorario.value; const s = timeToMin(inicioHorario.value); const e = timeToMin(finHorario.value);
      const overlap = horarios.some(h=> h.fecha===f && h.canchaId===ch && h.id!==currentId && (timeToMin(h.inicio) < e && s < timeToMin(h.fin)));
      if(overlap){ setError(formHorario,'inicioHorario','Solapa con otro horario en la cancha'); setError(formHorario,'finHorario','Solapa con otro horario en la cancha'); ok=false; }
    }

    return ok;
  }

  function submitHorario(e){
    e.preventDefault(); if(!validateHorario()) return;
    const payload = {
      id: horarioId.value || GlobalStore.nextId('H'),
      equipoId: equipoHorario.value,
      canchaId: canchaHorario.value,
      fecha: fechaHorario.value,
      inicio: inicioHorario.value,
      fin: finHorario.value,
      plantillaId: plantillaHorario.value || undefined,
    };
    if(horarioId.value){ const idx = horarios.findIndex(x=>x.id===horarioId.value); if(idx>-1) horarios[idx] = {...horarios[idx], ...payload}; }
    else { horarios.push(payload); }
    closeModal(modalHorario); renderHorarios();
  }

  function openCreateCancha(){ resetCanchaForm(); tituloCancha.textContent='Nueva Cancha'; openModal(modalCancha); }
  function openEditCancha(id){
    const c = canchas.find(x=>x.id===id); if(!c) return;
    resetCanchaForm(); tituloCancha.textContent='Editar Cancha';
    canchaId.value = c.id; nombreCancha.value=c.nombre; ubicacionCancha.value=c.ubicacion||'';
    openModal(modalCancha);
  }
  function validateCancha(){ clearErrors(formCancha); let ok=true; if(!nombreCancha.value.trim()){ setError(formCancha,'nombreCancha','Campo requerido'); ok=false; } return ok; }
  function submitCancha(e){ e.preventDefault(); if(!validateCancha()) return; const payload={ id:canchaId.value||GlobalStore.nextId('CH'), nombre:nombreCancha.value.trim(), ubicacion:ubicacionCancha.value.trim()}; if(canchaId.value){ const idx=canchas.findIndex(x=>x.id===canchaId.value); if(idx>-1) canchas[idx]={...canchas[idx],...payload}; } else { canchas.push(payload); } closeModal(modalCancha); renderCanchas(); }

  function deletePlantilla(id){ plantillas = plantillas.filter(p=>p.id!==id); renderPlantillas(); }
  function deleteHorario(id){ horarios = horarios.filter(h=>h.id!==id); renderHorarios(); }
  function deleteCancha(id){ const used = horarios.some(h=>h.canchaId===id); if(used){ alert('No se puede eliminar. Existen horarios que usan esta cancha.'); return; } canchas = canchas.filter(c=>c.id!==id); renderCanchas(); renderHorarios(); }

  // Eventos
  btnNuevaPlantilla.addEventListener('click', openCreatePlantilla);
  btnNuevoHorario.addEventListener('click', openCreateHorario);
  btnNuevaCancha.addEventListener('click', openCreateCancha);

  buscarPlantilla.addEventListener('input', renderPlantillas);
  filtroEquipo.addEventListener('change', renderHorarios);
  filtroCancha.addEventListener('change', renderHorarios);
  filtroFecha.addEventListener('change', renderHorarios);

  cerrarModalPlantilla.addEventListener('click', ()=> closeModal(modalPlantilla));
  cancelarPlantilla.addEventListener('click', ()=> closeModal(modalPlantilla));
  formPlantilla.addEventListener('submit', submitPlantilla);

  cerrarModalHorario.addEventListener('click', ()=> closeModal(modalHorario));
  cancelarHorario.addEventListener('click', ()=> closeModal(modalHorario));
  formHorario.addEventListener('submit', submitHorario);

  cerrarModalCancha.addEventListener('click', ()=> closeModal(modalCancha));
  cancelarCancha.addEventListener('click', ()=> closeModal(modalCancha));
  formCancha.addEventListener('submit', submitCancha);

  tbodyPlantillas.addEventListener('click', (e)=>{
    const btn = e.target.closest('button[data-action]'); if(!btn) return;
    const id = btn.dataset.id; const action = btn.dataset.action;
    if(action==='edit-template') openEditPlantilla(id);
    if(action==='del-template') confirmDialog({ title:'Eliminar plantilla', message:'¿Eliminar la plantilla?', onAccept:()=> deletePlantilla(id)});
  });

  tbodyHorarios.addEventListener('click', (e)=>{
    const btn = e.target.closest('button[data-action]'); if(!btn) return;
    const id = btn.dataset.id; const action = btn.dataset.action;
    if(action==='edit-time') openEditHorario(id);
    if(action==='del-time') confirmDialog({ title:'Eliminar horario', message:'¿Eliminar el horario?', onAccept:()=> deleteHorario(id)});
  });

  tbodyCanchas.addEventListener('click', (e)=>{
    const btn = e.target.closest('button[data-action]'); if(!btn) return;
    const id = btn.dataset.id; const action = btn.dataset.action;
    if(action==='edit-field') openEditCancha(id);
    if(action==='del-field') confirmDialog({ title:'Eliminar cancha', message:'¿Eliminar la cancha?', onAccept:()=> deleteCancha(id)});
  });

  // Init
  renderPlantillas(); renderCanchas(); renderEquipos(); renderHorarios();
})();
