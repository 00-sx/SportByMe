(function(){
  const { download, toCSV } = window.AdminCommon;

  // Data simulada de destinatarios (deportistas y acudientes del equipo)
  const destinatarios = [
    {id:'D-1', nombre:'Juan López (Deportista)'},
    {id:'D-2', nombre:'Andrés Gómez (Deportista)'}
  ];

  let recibidos = [
    {fecha:'2025-09-05 10:30', de:'Administrador', mensaje:'Recordatorio de reunión mensual.'}
  ];

  const selectDest = document.getElementById('destinatarios');
  const txtMensaje = document.getElementById('mensaje');
  const formMensaje = document.getElementById('formMensaje');
  const tbodyRecibidos = document.querySelector('#tablaRecibidos tbody');

  function renderDest(){ selectDest.innerHTML = destinatarios.map(d=>`<option value="${d.id}">${d.nombre}</option>`).join(''); }
  function renderRecibidos(){ tbodyRecibidos.innerHTML = recibidos.map(r=>`<tr><td>${r.fecha}</td><td>${r.de}</td><td>${r.mensaje}</td></tr>`).join(''); }

  function enviar(e){ e.preventDefault(); const ids = Array.from(selectDest.selectedOptions).map(o=>o.value); const msg = txtMensaje.value.trim(); if(!ids.length || !msg){ alert('Seleccione destinatarios y escriba un mensaje.'); return; } alert('Mensaje enviado (simulado).'); txtMensaje.value=''; selectDest.selectedIndex=-1; }

  // Init
  renderDest(); renderRecibidos();
  formMensaje.addEventListener('submit', enviar);
})();
