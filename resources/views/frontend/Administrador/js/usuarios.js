(function(){
  const {
    GlobalStore,
    openModal, closeModal,
    serializeForm, clearErrors, setError, validateEmail,
    toCSV, download,
    confirmDialog
  } = window.AdminCommon;

  // Datos simulados
  let usuarios = [
    {id:'U-1', username:'admin', nombres:'Carlos', apellidos:'García', documento:'1001', telefono:'3001112222', email:'admin@club.com', rol:'Administrador', estado:'Activo'},
    {id:'U-2', username:'coach1', nombres:'Marta', apellidos:'Pérez', documento:'2002', telefono:'3002223333', email:'marta.perez@club.com', rol:'Entrenador', estado:'Activo'},
    {id:'U-3', username:'player10', nombres:'Juan', apellidos:'Lopez', documento:'3003', telefono:'', email:'juan.lopez@club.com', rol:'Deportista', estado:'Activo'},
    {id:'U-4', username:'tutor77', nombres:'Ana', apellidos:'Rojas', documento:'4004', telefono:'', email:'ana.rojas@gmail.com', rol:'Acudiente', estado:'Inactivo'},
  ];

  // Elementos
  const tbody = document.querySelector('#tablaUsuarios tbody');
  const filtroRol = document.getElementById('filtroRol');
  const filtroEstado = document.getElementById('filtroEstado');
  const buscarUsuario = document.getElementById('buscarUsuario');
  const btnNuevoUsuario = document.getElementById('btnNuevoUsuario');
  const btnExportarUsuarios = document.getElementById('btnExportarUsuarios');

  const modal = document.getElementById('modalUsuario');
  const form = document.getElementById('formUsuario');
  const tituloModal = document.getElementById('modalUsuarioTitulo');
  const btnCerrarModal = document.getElementById('cerrarModalUsuario');
  const btnCancelarUsuario = document.getElementById('btnCancelarUsuario');

  const inputId = document.getElementById('usuarioId');
  const inputNombres = document.getElementById('nombres');
  const inputApellidos = document.getElementById('apellidos');
  const inputDocumento = document.getElementById('documento');
  const inputTelefono = document.getElementById('telefono');
  const inputEmail = document.getElementById('email');
  const inputRol = document.getElementById('rol');
  const inputUsername = document.getElementById('username');
  const inputEstado = document.getElementById('estado');
  const inputPassword = document.getElementById('password');
  const inputConfirmPassword = document.getElementById('confirmPassword');

  function render(){
    const rol = filtroRol.value;
    const estado = filtroEstado.value;
    const q = buscarUsuario.value.trim().toLowerCase();

    const data = usuarios.filter(u=>{
      if(rol && u.rol !== rol) return false;
      if(estado && u.estado !== estado) return false;
      if(q){
        const t = `${u.nombres} ${u.apellidos} ${u.documento} ${u.email} ${u.username}`.toLowerCase();
        if(!t.includes(q)) return false;
      }
      return true;
    });

    tbody.innerHTML = data.map(u=>{
      const badge = u.estado === 'Activo' ? '<span class="badge success">Activo</span>' : '<span class="badge warning">Inactivo</span>';
      return `<tr>
        <td>${u.username}</td>
        <td>${u.nombres} ${u.apellidos}</td>
        <td>${u.rol}</td>
        <td>${u.email}</td>
        <td>${badge}</td>
        <td>
          <button class="btn" data-action="edit" data-id="${u.id}">Editar</button>
          <button class="btn" data-action="toggle" data-id="${u.id}">${u.estado==='Activo'?'Desactivar':'Activar'}</button>
          <button class="btn danger" data-action="delete" data-id="${u.id}">Eliminar</button>
        </td>
      </tr>`;
    }).join('');
  }

  function resetForm(){
    form.reset();
    inputId.value = '';
    clearErrors(form);
  }

  function openCreate(){
    resetForm();
    tituloModal.textContent = 'Nuevo Usuario';
    openModal(modal);
  }

  function openEdit(id){
    const u = usuarios.find(x=>x.id===id);
    if(!u) return;
    resetForm();
    inputId.value = u.id;
    inputNombres.value = u.nombres;
    inputApellidos.value = u.apellidos;
    inputDocumento.value = u.documento;
    inputTelefono.value = u.telefono || '';
    inputEmail.value = u.email;
    inputRol.value = u.rol;
    inputUsername.value = u.username;
    inputEstado.value = u.estado;
    inputPassword.value = '';
    inputConfirmPassword.value = '';
    tituloModal.textContent = 'Editar Usuario';
    openModal(modal);
  }

  function validate(){
    clearErrors(form);
    let ok = true;
    const required = [
      ['nombres', inputNombres.value.trim()],
      ['apellidos', inputApellidos.value.trim()],
      ['documento', inputDocumento.value.trim()],
      ['email', inputEmail.value.trim()],
      ['rol', inputRol.value],
      ['username', inputUsername.value.trim()],
      ['estado', inputEstado.value],
    ];
    required.forEach(([id, val])=>{
      if(!val){ setError(form, id, 'Campo requerido'); ok=false; }
    });

    if(inputEmail.value && !validateEmail(inputEmail.value)){
      setError(form,'email','Email inválido'); ok=false;
    }

    const creating = !inputId.value;
    if(creating && !inputPassword.value){ setError(form,'password','Requerida al crear'); ok = false; }
    if(inputPassword.value || inputConfirmPassword.value){
      if(inputPassword.value.length < 6){ setError(form,'password','Mínimo 6 caracteres'); ok=false; }
      if(inputPassword.value !== inputConfirmPassword.value){ setError(form,'confirmPassword','No coincide'); ok=false; }
    }

    // Validación de username único
    const exists = usuarios.some(u => u.username.toLowerCase() === inputUsername.value.trim().toLowerCase() && u.id !== inputId.value);
    if(exists){ setError(form,'username','Usuario ya existe'); ok=false; }

    return ok;
  }

  function onSubmit(e){
    e.preventDefault();
    if(!validate()) return;

    const id = inputId.value;
    const payload = {
      id: id || GlobalStore.nextId('U'),
      username: inputUsername.value.trim(),
      nombres: inputNombres.value.trim(),
      apellidos: inputApellidos.value.trim(),
      documento: inputDocumento.value.trim(),
      telefono: inputTelefono.value.trim(),
      email: inputEmail.value.trim(),
      rol: inputRol.value,
      estado: inputEstado.value,
    };

    if(id){
      const idx = usuarios.findIndex(u=>u.id===id);
      if(idx>-1) usuarios[idx] = {...usuarios[idx], ...payload};
    } else {
      usuarios.push(payload);
    }

    closeModal(modal);
    render();
  }

  function removeUser(id){
    usuarios = usuarios.filter(u=>u.id!==id);
    render();
  }

  function toggleUser(id){
    const u = usuarios.find(x=>x.id===id); if(!u) return;
    u.estado = (u.estado === 'Activo') ? 'Inactivo' : 'Activo';
    render();
  }

  function exportCSV(){
    const headers = [
      {label:'Usuario', value:r=>r.username},
      {label:'Nombres', value:r=>r.nombres},
      {label:'Apellidos', value:r=>r.apellidos},
      {label:'Documento', value:r=>r.documento},
      {label:'Email', value:r=>r.email},
      {label:'Rol', value:r=>r.rol},
      {label:'Estado', value:r=>r.estado},
    ];
    const csv = toCSV(headers, usuarios);
    download(`usuarios_${Date.now()}.csv`, csv, 'text/csv;charset=utf-8');
  }

  // Eventos
  btnNuevoUsuario.addEventListener('click', openCreate);
  btnExportarUsuarios.addEventListener('click', exportCSV);
  filtroRol.addEventListener('change', render);
  filtroEstado.addEventListener('change', render);
  buscarUsuario.addEventListener('input', render);
  btnCerrarModal.addEventListener('click', ()=> closeModal(modal));
  btnCancelarUsuario.addEventListener('click', ()=> closeModal(modal));
  form.addEventListener('submit', onSubmit);

  tbody.addEventListener('click', (e)=>{
    const btn = e.target.closest('button[data-action]');
    if(!btn) return;
    const id = btn.getAttribute('data-id');
    const action = btn.getAttribute('data-action');
    if(action==='edit') openEdit(id);
    if(action==='toggle') toggleUser(id);
    if(action==='delete') {
      confirmDialog({
        title:'Eliminar usuario',
        message:'Esta acción no se puede deshacer. ¿Eliminar usuario?',
        onAccept: ()=> removeUser(id)
      });
    }
  });

  // Inicializar
  render();
})();
