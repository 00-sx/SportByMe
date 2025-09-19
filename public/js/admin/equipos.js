(function(){
  const { GlobalStore, openModal, closeModal, clearErrors, setError, confirmDialog } = window.AdminCommon;

  // Datos simulados
  let categorias = [
    {id:'C-1', nombre:'Sub-8', edadMin:6, edadMax:8, descripcion:'Iniciación'},
    {id:'C-2', nombre:'Sub-12', edadMin:10, edadMax:12, descripcion:''},
    {id:'C-3', nombre:'Sub-16', edadMin:14, edadMax:16, descripcion:''},
  ];

  let usuarios = [
    {id:'U-1', rol:'Entrenador', nombres:'Marta', apellidos:'Pérez'},
    {id:'U-2', rol:'Entrenador', nombres:'Luis', apellidos:'Soto'},
    {id:'U-3', rol:'Deportista', nombres:'Juan', apellidos:'Lopez'},
    {id:'U-4', rol:'Deportista', nombres:'Andrés', apellidos:'Gómez'},
    {id:'U-5', rol:'Deportista', nombres:'Pedro', apellidos:'Ríos'},
  ];

  let equipos = [
    {id:'E-1', nombre:'Leones A', categoriaId:'C-2', entrenadorId:'U-1', jugadores:['U-3','U-4']},
    {id:'E-2', nombre:'Leones B', categoriaId:'C-2', entrenadorId:'U-2', jugadores:['U-5']},
  ];

  // Elementos
  const tbodyCategorias = document.querySelector('#tablaCategorias tbody');
  const tbodyEquipos = document.querySelector('#tablaEquipos tbody');
  const filtroCategoria = document.getElementById('filtroCategoria');
  const buscarEquipo = document.getElementById('buscarEquipo');

  const btnNuevaCategoria = document.getElementById('btnNuevaCategoria');
  const btnNuevoEquipo = document.getElementById('btnNuevoEquipo');

  // Modal categoría
  const modalCategoria = document.getElementById('modalCategoria');
  const formCategoria = document.getElementById('formCategoria');
  const tituloCategoria = document.getElementById('modalCategoriaTitulo');
  const btnCerrarCategoria = document.getElementById('cerrarModalCategoria');
  const btnCancelarCategoria = document.getElementById('btnCancelarCategoria');
  const catId = document.getElementById('categoriaId');
  const nombreCategoria = document.getElementById('nombreCategoria');
  const edadMin = document.getElementById('edadMin');
  const edadMax = document.getElementById('edadMax');
  const descCategoria = document.getElementById('descCategoria');

  // Modal equipo
  const modalEquipo = document.getElementById('modalEquipo');
  const formEquipo = document.getElementById('formEquipo');
  const tituloEquipo = document.getElementById('modalEquipoTitulo');
  const btnCerrarEquipo = document.getElementById('cerrarModalEquipo');
  const btnCancelarEquipo = document.getElementById('btnCancelarEquipo');
  const equipoId = document.getElementById('equipoId');
  const nombreEquipo = document.getElementById('nombreEquipo');
  const categoriaEquipo = document.getElementById('categoriaEquipo');
  const entrenadorEquipo = document.getElementById('entrenadorEquipo');

  // Modal asignar
  const modalAsignar = document.getElementById('modalAsignar');
  const cerrarModalAsignar = document.getElementById('cerrarModalAsignar');
  const asignarEquipoNombre = document.getElementById('asignarEquipoNombre');
  const jugadoresDisponibles = document.getElementById('jugadoresDisponibles');
  const jugadoresAsignados = document.getElementById('jugadoresAsignados');
  const btnAgregarJugador = document.getElementById('btnAgregarJugador');
  const btnQuitarJugador = document.getElementById('btnQuitarJugador');
  const btnGuardarAsignacion = document.getElementById('btnGuardarAsignacion');

  function renderCategorias(){
    // llenar select filtro y del formulario equipo
    filtroCategoria.innerHTML = '<option value="">Todas</option>' + categorias.map(c=>`<option value="${c.id}">${c.nombre}</option>`).join('');
    categoriaEquipo.innerHTML = categorias.map(c=>`<option value="${c.id}">${c.nombre}</option>`).join('');

    // tabla categorías
    tbodyCategorias.innerHTML = categorias.map(c=>{
      const countEquipos = equipos.filter(e=>e.categoriaId===c.id).length;
      const rango = (c.edadMin && c.edadMax) ? `${c.edadMin}-${c.edadMax}` : '-';
      return `<tr>
        <td>${c.nombre}</td>
        <td>${rango}</td>
        <td>${countEquipos}</td>
        <td>
          <button class="btn" data-action="edit-cat" data-id="${c.id}">Editar</button>
          <button class="btn danger" data-action="del-cat" data-id="${c.id}">Eliminar</button>
        </td>
      </tr>`
    }).join('');
  }

  function renderEquipos(){
    const q = buscarEquipo.value.trim().toLowerCase();
    const cat = filtroCategoria.value;

    const data = equipos.filter(e=>{
      if(cat && e.categoriaId !== cat) return false;
      if(q && !e.nombre.toLowerCase().includes(q)) return false;
      return true;
    });

    tbodyEquipos.innerHTML = data.map(e=>{
      const categoria = categorias.find(c=>c.id===e.categoriaId)?.nombre || '-';
      const entrenador = usuarios.find(u=>u.id===e.entrenadorId)?.nombres + ' ' + (usuarios.find(u=>u.id===e.entrenadorId)?.apellidos||'') || '-';
      return `<tr>
        <td>${e.nombre}</td>
        <td>${categoria}</td>
        <td>${entrenador}</td>
        <td>${e.jugadores.length}</td>
        <td>
          <button class="btn" data-action="assign" data-id="${e.id}">Asignar Jugadores</button>
          <button class="btn" data-action="edit-team" data-id="${e.id}">Editar</button>
          <button class="btn danger" data-action="del-team" data-id="${e.id}">Eliminar</button>
        </td>
      </tr>`
    }).join('');
  }

  function resetCatForm(){ formCategoria.reset(); catId.value = ''; clearErrors(formCategoria); }
  function resetTeamForm(){ formEquipo.reset(); equipoId.value = ''; clearErrors(formEquipo); }

  function openCreateCategoria(){ resetCatForm(); tituloCategoria.textContent='Nueva Categoría'; openModal(modalCategoria); }
  function openEditCategoria(id){
    const c = categorias.find(x=>x.id===id); if(!c) return;
    resetCatForm();
    catId.value = c.id; nombreCategoria.value=c.nombre; edadMin.value=c.edadMin||''; edadMax.value=c.edadMax||''; descCategoria.value=c.descripcion||'';
    tituloCategoria.textContent='Editar Categoría'; openModal(modalCategoria);
  }

  function openCreateEquipo(){
    resetTeamForm();
    if(categorias.length===0){ alert('Debe crear una categoría primero.'); return; }
    tituloEquipo.textContent='Nuevo Equipo';
    // entrenadores
    const coaches = usuarios.filter(u=>u.rol==='Entrenador');
    entrenadorEquipo.innerHTML = coaches.map(u=>`<option value="${u.id}">${u.nombres} ${u.apellidos}</option>`).join('');
    openModal(modalEquipo);
  }
  function openEditEquipo(id){
    const e = equipos.find(x=>x.id===id); if(!e) return;
    resetTeamForm();
    tituloEquipo.textContent='Editar Equipo';
    nombreEquipo.value = e.nombre;
    equipoId.value = e.id;
    categoriaEquipo.value = e.categoriaId;
    const coaches = usuarios.filter(u=>u.rol==='Entrenador');
    entrenadorEquipo.innerHTML = coaches.map(u=>`<option value="${u.id}">${u.nombres} ${u.apellidos}</option>`).join('');
    entrenadorEquipo.value = e.entrenadorId || '';
    openModal(modalEquipo);
  }

  function validateCategoria(){
    clearErrors(formCategoria);
    let ok = true;
    if(!nombreCategoria.value.trim()){ setError(formCategoria, 'nombreCategoria', 'Campo requerido'); ok=false; }
    if(edadMin.value && edadMax.value && Number(edadMin.value) > Number(edadMax.value)){
      setError(formCategoria, 'edadMax', 'Rango inválido'); ok=false;
    }
    return ok;
  }
  function validateEquipo(){
    clearErrors(formEquipo); let ok = true;
    if(!nombreEquipo.value.trim()){ setError(formEquipo,'nombreEquipo','Campo requerido'); ok=false; }
    if(!categoriaEquipo.value){ setError(formEquipo,'categoriaEquipo','Seleccione categoría'); ok=false; }
    if(!entrenadorEquipo.value){ setError(formEquipo,'entrenadorEquipo','Seleccione entrenador'); ok=false; }
    // Evitar dos equipos con mismo nombre en misma categoría
    const id = equipoId.value;
    const exists = equipos.some(e=> e.nombre.trim().toLowerCase()===nombreEquipo.value.trim().toLowerCase() && e.categoriaId===categoriaEquipo.value && e.id!==id);
    if(exists){ setError(formEquipo,'nombreEquipo','Ya existe en la categoría'); ok=false; }
    // Evitar un entrenador en dos equipos en misma categoría
    const coachTaken = equipos.some(e=> e.entrenadorId===entrenadorEquipo.value && e.categoriaId===categoriaEquipo.value && e.id!==id);
    if(coachTaken){ setError(formEquipo,'entrenadorEquipo','Entrenador ya asignado en esta categoría'); ok=false; }
    return ok;
  }

  function submitCategoria(e){
    e.preventDefault(); if(!validateCategoria()) return;
    const payload = {
      id: catId.value || GlobalStore.nextId('C'),
      nombre: nombreCategoria.value.trim(),
      edadMin: edadMin.value ? Number(edadMin.value) : undefined,
      edadMax: edadMax.value ? Number(edadMax.value) : undefined,
      descripcion: descCategoria.value.trim()
    };
    if(catId.value){
      const idx = categorias.findIndex(c=>c.id===catId.value); if(idx>-1) categorias[idx] = {...categorias[idx], ...payload};
    } else {
      categorias.push(payload);
    }
    closeModal(modalCategoria); renderCategorias(); renderEquipos();
  }

  function submitEquipo(e){
    e.preventDefault(); if(!validateEquipo()) return;
    const payload = {
      id: equipoId.value || GlobalStore.nextId('E'),
      nombre: nombreEquipo.value.trim(),
      categoriaId: categoriaEquipo.value,
      entrenadorId: entrenadorEquipo.value,
      jugadores: equipoId.value ? (equipos.find(x=>x.id===equipoId.value)?.jugadores || []) : []
    };
    if(equipoId.value){
      const idx = equipos.findIndex(x=>x.id===equipoId.value); if(idx>-1) equipos[idx] = {...equipos[idx], ...payload};
    } else {
      equipos.push(payload);
    }
    closeModal(modalEquipo); renderEquipos(); renderCategorias();
  }

  function deleteCategoria(id){
    const hasTeams = equipos.some(e=>e.categoriaId===id);
    if(hasTeams){ alert('No se puede eliminar. Existen equipos en la categoría.'); return; }
    categorias = categorias.filter(c=>c.id!==id);
    renderCategorias(); renderEquipos();
  }

  function deleteEquipo(id){
    equipos = equipos.filter(e=>e.id!==id);
    renderEquipos(); renderCategorias();
  }

  // Asignar jugadores
  let equipoAsignandoId = null;
  function openAsignar(id){
    const e = equipos.find(x=>x.id===id); if(!e) return;
    equipoAsignandoId = id;
    asignarEquipoNombre.textContent = e.nombre;
    const deportistas = usuarios.filter(u=>u.rol==='Deportista');
    const asignadosSet = new Set(e.jugadores);

    jugadoresDisponibles.innerHTML = deportistas.filter(u=>!asignadosSet.has(u.id)).map(u=>`<option value="${u.id}">${u.nombres} ${u.apellidos}</option>`).join('');
    jugadoresAsignados.innerHTML = deportistas.filter(u=>asignadosSet.has(u.id)).map(u=>`<option value="${u.id}">${u.nombres} ${u.apellidos}</option>`).join('');

    openModal(modalAsignar);
  }

  function moveOptions(from, to){
    Array.from(from.selectedOptions).forEach(opt=>{
      to.appendChild(opt);
    });
  }

  function saveAsignacion(){
    const e = equipos.find(x=>x.id===equipoAsignandoId); if(!e) return;
    e.jugadores = Array.from(jugadoresAsignados.options).map(o=>o.value);
    closeModal(modalAsignar); renderEquipos();
  }

  // Eventos
  btnNuevaCategoria.addEventListener('click', openCreateCategoria);
  btnNuevoEquipo.addEventListener('click', openCreateEquipo);
  filtroCategoria.addEventListener('change', renderEquipos);
  buscarEquipo.addEventListener('input', renderEquipos);

  btnCerrarCategoria.addEventListener('click', ()=> closeModal(modalCategoria));
  btnCancelarCategoria.addEventListener('click', ()=> closeModal(modalCategoria));
  formCategoria.addEventListener('submit', submitCategoria);

  btnCerrarEquipo.addEventListener('click', ()=> closeModal(modalEquipo));
  btnCancelarEquipo.addEventListener('click', ()=> closeModal(modalEquipo));
  formEquipo.addEventListener('submit', submitEquipo);

  cerrarModalAsignar.addEventListener('click', ()=> closeModal(modalAsignar));
  btnAgregarJugador.addEventListener('click', ()=> moveOptions(jugadoresDisponibles, jugadoresAsignados));
  btnQuitarJugador.addEventListener('click', ()=> moveOptions(jugadoresAsignados, jugadoresDisponibles));
  btnGuardarAsignacion.addEventListener('click', saveAsignacion);

  tbodyCategorias.addEventListener('click', (e)=>{
    const btn = e.target.closest('button[data-action]'); if(!btn) return;
    const id = btn.dataset.id; const action = btn.dataset.action;
    if(action==='edit-cat') openEditCategoria(id);
    if(action==='del-cat') confirmDialog({ title:'Eliminar categoría', message:'¿Eliminar la categoría?', onAccept:()=> deleteCategoria(id)});
  });

  tbodyEquipos.addEventListener('click', (e)=>{
    const btn = e.target.closest('button[data-action]'); if(!btn) return;
    const id = btn.dataset.id; const action = btn.dataset.action;
    if(action==='assign') openAsignar(id);
    if(action==='edit-team') openEditEquipo(id);
    if(action==='del-team') confirmDialog({ title:'Eliminar equipo', message:'¿Eliminar el equipo?', onAccept:()=> deleteEquipo(id)});
  });

  // Inicializar
  renderCategorias();
  // cargar entrenadores al abrir modal equipo dinámicamente en openCreateEquipo/openEditEquipo
  renderEquipos();
})();
