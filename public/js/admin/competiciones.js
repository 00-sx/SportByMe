(function(){
  const { GlobalStore, openModal, closeModal, clearErrors, setError, confirmDialog } = window.AdminCommon;

  // Datos simulados
  const equipos = [
    {id:'E-1', nombre:'Leones A'},
    {id:'E-2', nombre:'Leones B'},
    {id:'E-3', nombre:'Panteras'},
  ];

  let torneos = [
    {id:'T-1', nombre:'Liga Apertura', inicio:'2025-09-01', fin:'2025-12-01', equipos:['E-1','E-2','E-3']},
  ];

  let partidos = [
    {id:'M-1', torneoId:'T-1', fecha:'2025-09-15', local:'E-1', visitante:'E-2', gl:2, gv:2},
    {id:'M-2', torneoId:'T-1', fecha:'2025-09-22', local:'E-3', visitante:'E-1', gl:1, gv:3},
  ];

  // Elementos
  const tbodyTorneos = document.querySelector('#tablaTorneos tbody');
  const tbodyPartidos = document.querySelector('#tablaPartidos tbody');
  const tbodyPosiciones = document.querySelector('#tablaPosiciones tbody');
  const filtroTorneo = document.getElementById('filtroTorneo');

  // Torneo modal
  const modalTorneo = document.getElementById('modalTorneo');
  const formTorneo = document.getElementById('formTorneo');
  const tituloTorneo = document.getElementById('modalTorneoTitulo');
  const cerrarModalTorneo = document.getElementById('cerrarModalTorneo');
  const cancelarTorneo = document.getElementById('btnCancelarTorneo');
  const torneoId = document.getElementById('torneoId');
  const nombreTorneo = document.getElementById('nombreTorneo');
  const inicioTorneo = document.getElementById('inicioTorneo');
  const finTorneo = document.getElementById('finTorneo');
  const equiposTorneo = document.getElementById('equiposTorneo');

  // Partido modal
  const modalPartido = document.getElementById('modalPartido');
  const formPartido = document.getElementById('formPartido');
  const tituloPartido = document.getElementById('modalPartidoTitulo');
  const cerrarModalPartido = document.getElementById('cerrarModalPartido');
  const cancelarPartido = document.getElementById('btnCancelarPartido');
  const partidoId = document.getElementById('partidoId');
  const torneoPartido = document.getElementById('torneoPartido');
  const fechaPartido = document.getElementById('fechaPartido');
  const localPartido = document.getElementById('localPartido');
  const visitantePartido = document.getElementById('visitantePartido');
  const golesLocal = document.getElementById('golesLocal');
  const golesVisitante = document.getElementById('golesVisitante');

  const btnNuevoTorneo = document.getElementById('btnNuevoTorneo');
  const btnNuevoPartido = document.getElementById('btnNuevoPartido');

  function renderTorneos(){
    tbodyTorneos.innerHTML = torneos.map(t=>{
      return `<tr>
        <td>${t.nombre}</td>
        <td>${t.inicio||'-'}</td>
        <td>${t.fin||'-'}</td>
        <td>${t.equipos.length}</td>
        <td>
          <button class="btn" data-action="edit-torneo" data-id="${t.id}">Editar</button>
          <button class="btn danger" data-action="del-torneo" data-id="${t.id}">Eliminar</button>
        </td>
      </tr>`
    }).join('');

    filtroTorneo.innerHTML = '<option value="">Todos</option>' + torneos.map(t=>`<option value="${t.id}">${t.nombre}</option>`).join('');
    torneoPartido.innerHTML = torneos.map(t=>`<option value="${t.id}">${t.nombre}</option>`).join('');
  }

  function renderPartidos(){
    const t = filtroTorneo.value;
    const data = partidos.filter(p=> !t || p.torneoId===t);
    tbodyPartidos.innerHTML = data.map(p=>{
      const ln = equipos.find(e=>e.id===p.local)?.nombre||'-';
      const vn = equipos.find(e=>e.id===p.visitante)?.nombre||'-';
      const torneo = torneos.find(x=>x.id===p.torneoId)?.nombre || '-';
      const res = (typeof p.gl==='number' && typeof p.gv==='number') ? `${p.gl} - ${p.gv}` : '-';
      return `<tr>
        <td>${p.fecha||'-'}</td>
        <td>${ln}</td>
        <td>${vn}</td>
        <td>${res}</td>
        <td>${torneo}</td>
        <td>
          <button class="btn" data-action="edit-match" data-id="${p.id}">Editar</button>
          <button class="btn danger" data-action="del-match" data-id="${p.id}">Eliminar</button>
        </td>
      </tr>`
    }).join('');

    renderPosiciones();
  }

  function renderPosiciones(){
    const t = filtroTorneo.value || torneos[0]?.id;
    const equiposT = torneos.find(x=>x.id===t)?.equipos || [];
    const tabla = equiposT.reduce((acc,id)=>{ acc[id]={eq:id, pj:0,g:0,e:0,p:0,gf:0,gc:0,pts:0}; return acc; },{});

    partidos.filter(m=>m.torneoId===t).forEach(m=>{
      if(typeof m.gl!=='number' || typeof m.gv!=='number') return;
      const L = tabla[m.local]; const V = tabla[m.visitante]; if(!L||!V) return;
      L.pj++; V.pj++; L.gf+=m.gl; L.gc+=m.gv; V.gf+=m.gv; V.gc+=m.gl;
      if(m.gl>m.gv){ L.g++; V.p++; L.pts+=3; }
      else if(m.gl<m.gv){ V.g++; L.p++; V.pts+=3; }
      else { L.e++; V.e++; L.pts+=1; V.pts+=1; }
    });

    const rows = Object.values(tabla).map(r=>({
      ...r, dg: r.gf - r.gc, nombre: equipos.find(e=>e.id===r.eq)?.nombre || r.eq
    })).sort((a,b)=> b.pts - a.pts || b.dg - a.dg || b.gf - a.gf);

    tbodyPosiciones.innerHTML = rows.map(r=>`
      <tr>
        <td>${r.nombre}</td>
        <td>${r.pj}</td>
        <td>${r.g}</td>
        <td>${r.e}</td>
        <td>${r.p}</td>
        <td>${r.gf}</td>
        <td>${r.gc}</td>
        <td>${r.dg}</td>
        <td>${r.pts}</td>
      </tr>
    `).join('');
  }

  function openCreateTorneo(){ resetTorneoForm(); tituloTorneo.textContent='Nuevo Torneo'; fillEquiposSelect(); openModal(modalTorneo); }
  function openEditTorneo(id){ const t = torneos.find(x=>x.id===id); if(!t) return; resetTorneoForm(); tituloTorneo.textContent='Editar Torneo'; fillEquiposSelect(); torneoId.value=t.id; nombreTorneo.value=t.nombre; inicioTorneo.value=t.inicio||''; finTorneo.value=t.fin||''; Array.from(equiposTorneo.options).forEach(o=> o.selected = t.equipos.includes(o.value)); openModal(modalTorneo); }
  function resetTorneoForm(){ formTorneo.reset(); torneoId.value=''; clearErrors(formTorneo); }
  function fillEquiposSelect(){ equiposTorneo.innerHTML = equipos.map(e=>`<option value="${e.id}">${e.nombre}</option>`).join(''); }

  function validateTorneo(){
    clearErrors(formTorneo); let ok=true;
    if(!nombreTorneo.value.trim()){ setError(formTorneo,'nombreTorneo','Campo requerido'); ok=false; }
    if(inicioTorneo.value && finTorneo.value && (new Date(inicioTorneo.value) > new Date(finTorneo.value))){ setError(formTorneo,'finTorneo','No puede ser anterior'); ok=false; }
    return ok;
  }
  function submitTorneo(e){
    e.preventDefault(); if(!validateTorneo()) return;
    const eqSel = Array.from(equiposTorneo.selectedOptions).map(o=>o.value);
    const payload = { id: torneoId.value || GlobalStore.nextId('T'), nombre: nombreTorneo.value.trim(), inicio: inicioTorneo.value||undefined, fin: finTorneo.value||undefined, equipos: eqSel };
    if(torneoId.value){ const idx = torneos.findIndex(x=>x.id===torneoId.value); if(idx>-1) torneos[idx] = {...torneos[idx], ...payload}; }
    else { torneos.push(payload); }
    closeModal(modalTorneo); renderTorneos(); renderPartidos();
  }

  function openCreatePartido(){ resetPartidoForm(); tituloPartido.textContent='Nuevo Partido'; fillTorneoAndEquipos(); openModal(modalPartido); }
  function openEditPartido(id){ const p = partidos.find(x=>x.id===id); if(!p) return; resetPartidoForm(); tituloPartido.textContent='Editar Partido'; fillTorneoAndEquipos(); partidoId.value=p.id; torneoPartido.value=p.torneoId; onChangeTorneoPartido(); localPartido.value=p.local; visitantePartido.value=p.visitante; fechaPartido.value=p.fecha||''; golesLocal.value = typeof p.gl==='number'? p.gl:0; golesVisitante.value= typeof p.gv==='number'? p.gv:0; openModal(modalPartido); }
  function resetPartidoForm(){ formPartido.reset(); partidoId.value=''; clearErrors(formPartido); }

  function fillTorneoAndEquipos(){
    torneoPartido.innerHTML = torneos.map(t=>`<option value="${t.id}">${t.nombre}</option>`).join('');
    onChangeTorneoPartido();
  }
  function onChangeTorneoPartido(){
    const t = torneos.find(x=>x.id===torneoPartido.value);
    const list = (t?.equipos||[]).map(id=> equipos.find(e=>e.id===id)).filter(Boolean);
    const opts = list.map(e=>`<option value="${e.id}">${e.nombre}</option>`).join('');
    localPartido.innerHTML = opts; visitantePartido.innerHTML = opts;
  }

  function validatePartido(){
    clearErrors(formPartido); let ok=true;
    const req = [['torneoPartido',torneoPartido.value], ['fechaPartido',fechaPartido.value], ['localPartido',localPartido.value], ['visitantePartido',visitantePartido.value]];
    req.forEach(([id,val])=>{ if(!val){ setError(formPartido,id,'Campo requerido'); ok=false; } });
    if(localPartido.value && visitantePartido.value && localPartido.value===visitantePartido.value){ setError(formPartido,'visitantePartido','Debe ser distinto al local'); ok=false; }
    return ok;
  }
  function submitPartido(e){
    e.preventDefault(); if(!validatePartido()) return;
    const payload = { id: partidoId.value || GlobalStore.nextId('M'), torneoId: torneoPartido.value, fecha: fechaPartido.value, local: localPartido.value, visitante: visitantePartido.value, gl: Number(golesLocal.value||0), gv: Number(golesVisitante.value||0) };
    if(partidoId.value){ const idx = partidos.findIndex(x=>x.id===partidoId.value); if(idx>-1) partidos[idx] = {...partidos[idx], ...payload}; }
    else { partidos.push(payload); }
    closeModal(modalPartido); renderPartidos();
  }

  function deleteTorneo(id){
    const used = partidos.some(p=>p.torneoId===id);
    if(used){ alert('No se puede eliminar. Existen partidos asociados.'); return; }
    torneos = torneos.filter(t=>t.id!==id);
    renderTorneos(); renderPartidos();
  }

  function deletePartido(id){ partidos = partidos.filter(p=>p.id!==id); renderPartidos(); }

  // Eventos
  btnNuevoTorneo.addEventListener('click', openCreateTorneo);
  btnNuevoPartido.addEventListener('click', openCreatePartido);
  filtroTorneo.addEventListener('change', renderPartidos);

  cerrarModalTorneo.addEventListener('click', ()=> closeModal(modalTorneo));
  cancelarTorneo.addEventListener('click', ()=> closeModal(modalTorneo));
  formTorneo.addEventListener('submit', submitTorneo);

  cerrarModalPartido.addEventListener('click', ()=> closeModal(modalPartido));
  cancelarPartido.addEventListener('click', ()=> closeModal(modalPartido));
  formPartido.addEventListener('submit', submitPartido);
  torneoPartido.addEventListener('change', onChangeTorneoPartido);

  tbodyTorneos.addEventListener('click', (e)=>{
    const btn = e.target.closest('button[data-action]'); if(!btn) return; const id=btn.dataset.id; const a=btn.dataset.action;
    if(a==='edit-torneo') openEditTorneo(id);
    if(a==='del-torneo') confirmDialog({title:'Eliminar torneo', message:'¿Eliminar el torneo?', onAccept:()=> deleteTorneo(id)});
  });
  tbodyPartidos.addEventListener('click', (e)=>{
    const btn = e.target.closest('button[data-action]'); if(!btn) return; const id=btn.dataset.id; const a=btn.dataset.action;
    if(a==='edit-match') openEditPartido(id);
    if(a==='del-match') confirmDialog({title:'Eliminar partido', message:'¿Eliminar el partido?', onAccept:()=> deletePartido(id)});
  });

  // Init
  renderTorneos(); renderPartidos();
})();
