(function(){
  // Datos simulados
  const mensajes = [
    {fecha:'2025-09-03 09:00', de:'Administrador', mensaje:'Bienvenidos al periodo 2025-2.'},
    {fecha:'2025-09-10 18:00', de:'Entrenador', mensaje:'Buen partido hoy, revisa tu recuperación.'}
  ];
  const notifs = [
    {fecha:'2025-09-11', titulo:'Pago de mensualidad', detalle:'Vence el 15/09'},
    {fecha:'2025-09-13', titulo:'Partido vs Panteras', detalle:'Convocatoria 8:00 AM'},
  ];

  const tbodyMsgs = document.querySelector('#tablaMensajes tbody');
  const tbodyNot = document.querySelector('#tablaNotificaciones tbody');

  function render(){
    tbodyMsgs.innerHTML = mensajes.map(m=>`<tr><td>${m.fecha}</td><td>${m.de}</td><td>${m.mensaje}</td></tr>`).join('');
    tbodyNot.innerHTML = notifs.map(n=>`<tr><td>${n.fecha}</td><td>${n.titulo}</td><td>${n.detalle}</td></tr>`).join('');
  }

  render();
})();
