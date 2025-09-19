(function(){
  const { GlobalStore, openModal, closeModal, clearErrors, setError, confirmDialog } = window.AdminCommon;

  // Data simulada del equipo del entrenador
  const jugadores = [
    {id:'P-1', nombre:'Juan López'},
    {id:'P-2', nombre:'Andrés Gómez'},
    {id:'P-3', nombre:'Pedro Ríos'},
  ];

  let convocatorias = [
    {id:'CV-1', fecha:'2025-09-12', rival:'Panteras', formacion:'4-3-3', jugadores:['P-1','P-2']},
  ];

  let resultados = [
    {id:'RS-1', fecha:'2025-09-12', rival:'Panteras', gf:2, gc:1},
  ];

  // Elementos
  const tbodyConv = document.querySelector('#tablaConvocatorias tbody');
  const tbodyRes = document.querySelector('#tablaResultados tbody');

  // Modal conv
  const modalConv = document.getElementById('modalConv');
  const formConv = document.getElementById('formConv');
  const convId = document.getElementById('convId');
  const fechaConv = document.getElementById('fechaConv');
  const rivalConv = document.getElementById('rivalConv');
  const formacionConv = document.getElementById('formacionConv');
  const jugadoresConv = document.getElementById('jugadoresConv');
  const cerrarModalConv = document.getElementById('cerrarModalConv');
  const cancelarConv = document.getElementById('btnCancelarConv');

  // Modal res
  const modalRes = document.getElementById('modalRes');
  const formRes = document.getElementById('formRes');
  const resId = document.getElementById('resId');
  const fechaRes = document.getElementById('fechaRes');
  const rivalRes = document.getElementById('rivalRes');
  const golesFavor = document.getElementById('golesFavor');
  const golesContra = document.getElementById('golesContra');
  const cerrarModalRes = document.getElementById('cerrarModalRes');
  const cancelarRes = document.getElementById('btnCancelarRes');

  function renderConv(){
    tbodyConv.innerHTML = convocatorias.map(c=>{
      return `<tr>
        <td>${c.fecha}</td>
        <td>${c.rival}</td>
        <td>${c.jugadores.length}</td>
        <td>${c.formacion}</td>
        <td>
          <button class="btn" data-action="edit-conv" data-id="${c.id}">Editar</button>
          <button class="btn danger" data-action="del-conv" data-id="${c.id}">Eliminar</button>
        </td>
      </tr>`
    }).join('');
  }

  function renderRes(){
    tbodyRes.innerHTML = resultados.map(r=>{
      const marcador = `${r.gf} - ${r.gc}`;
      return `<tr>
        <td>${r.fecha}</td>
        <td>${r.rival}</td>
        <td>${marcador}</td>
        <td>${r.gf}</td>
        <td>${r.gc}</td>
        <td>
          <button class="btn" data-action="edit-res" data-id="${r.id}">Editar</button>
          <button class="btn danger" data-action="del-res" data-id="${r.id}">Eliminar</button>
        </td>
      </tr>`
    }).join('');
  }

  function fillJugadores(){ jugadoresConv.innerHTML = jugadores.map(j=>`<option value="${j.id}">${j.nombre}</option>`).join(''); }

  function resetConvForm(){ formConv.reset(); convId.value=''; clearErrors(formConv); }
  function resetResForm(){ formRes.reset(); resId.value=''; clearErrors(formRes); }

  function openCreateConv(){ resetConvForm(); fillJugadores(); openModal(modalConv); }
  function openEditConv(id){ const c = convocatorias.find(x=>x.id===id); if(!c) return; resetConvForm(); fillJugadores(); convId.value=c.id; fechaConv.value=c.fecha; rivalConv.value=c.rival; formacionConv.value=c.formacion; const set=new Set(c.jugadores); Array.from(jugadoresConv.options).forEach(o=> o.selected=set.has(o.value)); openModal(modalConv); }
  function validateConv(){ clearErrors(formConv); let ok=true; if(!fechaConv.value){ setError(formConv,'fechaConv','Campo requerido'); ok=false; } if(!rivalConv.value.trim()){ setError(formConv,'rivalConv','Campo requerido'); ok=false; } return ok; }
  function submitConv(e){ e.preventDefault(); if(!validateConv()) return; const payload={ id: convId.value||GlobalStore.nextId('CV'), fecha:fechaConv.value, rival:rivalConv.value.trim(), formacion:formacionConv.value, jugadores: Array.from(jugadoresConv.selectedOptions).map(o=>o.value) }; if(convId.value){ const idx=convocatorias.findIndex(x=>x.id===convId.value); if(idx>-1) convocatorias[idx]={...convocatorias[idx], ...payload}; } else { convocatorias.push(payload); } closeModal(modalConv); renderConv(); }

  function openCreateRes(){ resetResForm(); openModal(modalRes); }
  function openEditRes(id){ const r = resultados.find(x=>x.id===id); if(!r) return; resetResForm(); resId.value=r.id; fechaRes.value=r.fecha; rivalRes.value=r.rival; golesFavor.value=r.gf; golesContra.value=r.gc; openModal(modalRes); }
  function validateRes(){ clearErrors(formRes); let ok=true; if(!fechaRes.value){ setError(formRes,'fechaRes','Campo requerido'); ok=false; } if(!rivalRes.value.trim()){ setError(formRes,'rivalRes','Campo requerido'); ok=false; } return ok; }
  function submitRes(e){ e.preventDefault(); if(!validateRes()) return; const payload={ id: resId.value||GlobalStore.nextId('RS'), fecha:fechaRes.value, rival:rivalRes.value.trim(), gf:Number(golesFavor.value||0), gc:Number(golesContra.value||0) }; if(resId.value){ const idx=resultados.findIndex(x=>x.id===resId.value); if(idx>-1) resultados[idx]={...resultados[idx], ...payload}; } else { resultados.push(payload); } closeModal(modalRes); renderRes(); }

  function deleteConv(id){ convocatorias = convocatorias.filter(c=>c.id!==id); renderConv(); }
  function deleteRes(id){ resultados = resultados.filter(r=>r.id!==id); renderRes(); }

  // Eventos
  document.getElementById('btnNuevaConvocatoria').addEventListener('click', openCreateConv);
  document.getElementById('btnNuevoResultado').addEventListener('click', openCreateRes);
  cerrarModalConv.addEventListener('click', ()=> closeModal(modalConv));
  cancelarConv.addEventListener('click', ()=> closeModal(modalConv));
  formConv.addEventListener('submit', submitConv);

  cerrarModalRes.addEventListener('click', ()=> closeModal(modalRes));
  cancelarRes.addEventListener('click', ()=> closeModal(modalRes));
  formRes.addEventListener('submit', submitRes);

  tbodyConv.addEventListener('click', (e)=>{
    const btn = e.target.closest('button[data-action]'); if(!btn) return; const id=btn.dataset.id; const a=btn.dataset.action;
    if(a==='edit-conv') openEditConv(id);
    if(a==='del-conv') confirmDialog({title:'Eliminar convocatoria', message:'¿Eliminar la convocatoria?', onAccept:()=> deleteConv(id)});
  });

  tbodyRes.addEventListener('click', (e)=>{
    const btn = e.target.closest('button[data-action]'); if(!btn) return; const id=btn.dataset.id; const a=btn.dataset.action;
    if(a==='edit-res') openEditRes(id);
    if(a==='del-res') confirmDialog({title:'Eliminar resultado', message:'¿Eliminar el resultado?', onAccept:()=> deleteRes(id)});
  });

  // Init
  renderConv(); renderRes();
})();
