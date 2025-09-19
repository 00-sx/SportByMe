(function(){
  const { GlobalStore, openModal, closeModal, clearErrors, setError, confirmDialog } = window.AdminCommon;

  // Datos simulados (categorías del club y roster propio del entrenador)
  const categorias = [ {id:'C-1', nombre:'Sub-12'}, {id:'C-2', nombre:'Sub-16'} ];
  const roster = {
    'C-1': [ {id:'P-1', nombre:'Juan López'}, {id:'P-2', nombre:'Andrés Gómez'} ],
    'C-2': [ {id:'P-3', nombre:'Pedro Ríos'} ]
  };

  let planes = [
    {id:'PL-1', nombre:'Fuerza básica', categoriaId:'C-1', objetivo:'Resistencia', duracion:45},
  ];
  let sesiones = [
    {id:'S-1', fecha:'2025-09-10', categoriaId:'C-1', planId:'PL-1', presentes:['P-1']},
  ];

  // Elementos
  const tbodyPlanes = document.querySelector('#tablaPlanes tbody');
  const tbodySesiones = document.querySelector('#tablaSesiones tbody');
  const filtroCategoriaSes = document.getElementById('filtroCategoriaSes');
  const filtroFechaSes = document.getElementById('filtroFechaSes');

  // Modal plan
  const modalPlan = document.getElementById('modalPlan');
  const formPlan = document.getElementById('formPlan');
  const planId = document.getElementById('planId');
  const nombrePlan = document.getElementById('nombrePlan');
  const categoriaPlan = document.getElementById('categoriaPlan');
  const objetivoPlan = document.getElementById('objetivoPlan');
  const duracionPlan = document.getElementById('duracionPlan');
  const cerrarModalPlan = document.getElementById('cerrarModalPlan');
  const cancelarPlan = document.getElementById('btnCancelarPlan');

  // Modal sesión
  const modalSesion = document.getElementById('modalSesion');
  const formSesion = document.getElementById('formSesion');
  const sesionId = document.getElementById('sesionId');
  const fechaSesion = document.getElementById('fechaSesion');
  const categoriaSesion = document.getElementById('categoriaSesion');
  const planSesion = document.getElementById('planSesion');
  const listaAsistencia = document.getElementById('listaAsistencia');
  const cerrarModalSesion = document.getElementById('cerrarModalSesion');
  const cancelarSesion = document.getElementById('btnCancelarSesion');

  function renderCategorias(){
    const opts = categorias.map(c=>`<option value="${c.id}">${c.nombre}</option>`).join('');
    categoriaPlan.innerHTML = opts;
    filtroCategoriaSes.innerHTML = '<option value="">Todas</option>'+opts;
    categoriaSesion.innerHTML = opts;
  }

  function renderPlanes(){
    tbodyPlanes.innerHTML = planes.map(p=>{
      const categoria = categorias.find(c=>c.id===p.categoriaId)?.nombre || '-';
      return `<tr>
        <td>${p.nombre}</td>
        <td>${categoria}</td>
        <td>${p.objetivo||'-'}</td>
        <td>${p.duracion||'-'} min</td>
        <td>
          <button class="btn" data-action="edit-plan" data-id="${p.id}">Editar</button>
          <button class="btn danger" data-action="del-plan" data-id="${p.id}">Eliminar</button>
        </td>
      </tr>`
    }).join('');

    // Para el modal de sesión
    planSesion.innerHTML = planes.map(p=>`<option value="${p.id}">${p.nombre}</option>`).join('');
  }

  function renderSesiones(){
    const cat = filtroCategoriaSes.value; const f = filtroFechaSes.value;
    const data = sesiones.filter(s=>{ if(cat && s.categoriaId!==cat) return false; if(f && s.fecha!==f) return false; return true; });
    tbodySesiones.innerHTML = data.map(s=>{
      const categoria = categorias.find(c=>c.id===s.categoriaId)?.nombre || '-';
      const plan = planes.find(p=>p.id===s.planId)?.nombre || '-';
      const asistencia = `${s.presentes.length} presentes`;
      return `<tr>
        <td>${s.fecha}</td>
        <td>${categoria}</td>
        <td>${plan}</td>
        <td>${asistencia}</td>
        <td>
          <button class="btn" data-action="edit-sesion" data-id="${s.id}">Editar</button>
          <button class="btn danger" data-action="del-sesion" data-id="${s.id}">Eliminar</button>
        </td>
      </tr>`
    }).join('');
  }

  function fillRosterSelect(){
    const catId = categoriaSesion.value;
    const list = roster[catId] || [];
    listaAsistencia.innerHTML = list.map(j=>`<option value="${j.id}">${j.nombre}</option>`).join('');
  }

  function resetPlanForm(){ formPlan.reset(); planId.value=''; clearErrors(formPlan); }
  function resetSesionForm(){ formSesion.reset(); sesionId.value=''; clearErrors(formSesion); }

  function openCreatePlan(){ resetPlanForm(); openModal(modalPlan); }
  function openEditPlan(id){ const p = planes.find(x=>x.id===id); if(!p) return; resetPlanForm(); planId.value=p.id; nombrePlan.value=p.nombre; categoriaPlan.value=p.categoriaId; objetivoPlan.value=p.objetivo||''; duracionPlan.value=p.duracion||''; openModal(modalPlan); }

  function validatePlan(){ clearErrors(formPlan); let ok=true; if(!nombrePlan.value.trim()){ setError(formPlan,'nombrePlan','Campo requerido'); ok=false; } if(!categoriaPlan.value){ setError(formPlan,'categoriaPlan','Seleccione categoría'); ok=false; } if(duracionPlan.value && Number(duracionPlan.value)<10){ setError(formPlan,'duracionPlan','Mínimo 10'); ok=false; } return ok; }
  function submitPlan(e){ e.preventDefault(); if(!validatePlan()) return; const payload={ id: planId.value||GlobalStore.nextId('PL'), nombre:nombrePlan.value.trim(), categoriaId: categoriaPlan.value, objetivo: objetivoPlan.value.trim(), duracion: duracionPlan.value? Number(duracionPlan.value): undefined }; if(planId.value){ const idx = planes.findIndex(x=>x.id===planId.value); if(idx>-1) planes[idx]={...planes[idx], ...payload}; } else { planes.push(payload); } closeModal(modalPlan); renderPlanes(); }

  function openCreateSesion(){ resetSesionForm(); renderPlanes(); renderCategorias(); categoriaSesion.value = categorias[0]?.id || ''; fillRosterSelect(); openModal(modalSesion); }
  function openEditSesion(id){ const s = sesiones.find(x=>x.id===id); if(!s) return; resetSesionForm(); renderPlanes(); renderCategorias(); sesionId.value=s.id; fechaSesion.value=s.fecha; categoriaSesion.value=s.categoriaId; fillRosterSelect(); planSesion.value=s.planId; // marcar asistencia
    const set = new Set(s.presentes); Array.from(listaAsistencia.options).forEach(o=> o.selected = set.has(o.value)); openModal(modalSesion); }

  function validateSesion(){ clearErrors(formSesion); let ok=true; const req=[['fechaSesion',fechaSesion.value],['categoriaSesion',categoriaSesion.value],['planSesion',planSesion.value]]; req.forEach(([id,val])=>{ if(!val){ setError(formSesion,id,'Campo requerido'); ok=false; } }); return ok; }
  function submitSesion(e){ e.preventDefault(); if(!validateSesion()) return; const payload={ id: sesionId.value||GlobalStore.nextId('S'), fecha: fechaSesion.value, categoriaId: categoriaSesion.value, planId: planSesion.value, presentes: Array.from(listaAsistencia.selectedOptions).map(o=>o.value) }; if(sesionId.value){ const idx = sesiones.findIndex(x=>x.id===sesionId.value); if(idx>-1) sesiones[idx]={...sesiones[idx], ...payload}; } else { sesiones.push(payload); } closeModal(modalSesion); renderSesiones(); }

  function deletePlan(id){
    const used = sesiones.some(s=>s.planId===id);
    if(used){ alert('No se puede eliminar. Hay sesiones que usan este plan.'); return; }
    planes = planes.filter(p=>p.id!==id); renderPlanes(); renderSesiones();
  }
  function deleteSesion(id){ sesiones = sesiones.filter(s=>s.id!==id); renderSesiones(); }

  // Eventos
  document.getElementById('btnNuevoPlan').addEventListener('click', openCreatePlan);
  document.getElementById('btnNuevaSesion').addEventListener('click', openCreateSesion);
  filtroCategoriaSes.addEventListener('change', renderSesiones);
  filtroFechaSes.addEventListener('change', renderSesiones);

  cerrarModalPlan.addEventListener('click', ()=> closeModal(modalPlan));
  cancelarPlan.addEventListener('click', ()=> closeModal(modalPlan));
  formPlan.addEventListener('submit', submitPlan);

  cerrarModalSesion.addEventListener('click', ()=> closeModal(modalSesion));
  cancelarSesion.addEventListener('click', ()=> closeModal(modalSesion));
  formSesion.addEventListener('submit', submitSesion);
  categoriaSesion.addEventListener('change', fillRosterSelect);

  tbodyPlanes.addEventListener('click', (e)=>{
    const btn = e.target.closest('button[data-action]'); if(!btn) return; const id=btn.dataset.id; const a=btn.dataset.action;
    if(a==='edit-plan') openEditPlan(id);
    if(a==='del-plan') confirmDialog({title:'Eliminar plan', message:'¿Eliminar el plan?', onAccept:()=> deletePlan(id)});
  });

  tbodySesiones.addEventListener('click', (e)=>{
    const btn = e.target.closest('button[data-action]'); if(!btn) return; const id=btn.dataset.id; const a=btn.dataset.action;
    if(a==='edit-sesion') openEditSesion(id);
    if(a==='del-sesion') confirmDialog({title:'Eliminar sesión', message:'¿Eliminar la sesión?', onAccept:()=> deleteSesion(id)});
  });

  // Init
  renderCategorias(); renderPlanes(); renderSesiones();
})();
