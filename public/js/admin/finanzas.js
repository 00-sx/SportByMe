(function(){
  const { GlobalStore, openModal, closeModal, clearErrors, setError, toCSV, download, confirmDialog } = window.AdminCommon;

  // Datos simulados
  const deportistas = [
    {id:'U-3', nombre:'Juan Lopez'},
    {id:'U-4', nombre:'Andrés Gómez'},
    {id:'U-5', nombre:'Pedro Ríos'},
  ];

  let pagos = [
    {id:'PAG-1', codigo:'FAC-2025-0001', fecha:'2025-09-05', deportistaId:'U-3', deportista:'Juan Lopez', concepto:'Mensualidad', periodo:'2025-09', monto:80000, estado:'Pagado'},
    {id:'PAG-2', codigo:'FAC-2025-0002', fecha:'2025-09-07', deportistaId:'U-4', deportista:'Andrés Gómez', concepto:'Uniforme', periodo:'', monto:120000, estado:'Pendiente'},
  ];

  // Elementos
  const filtroPeriodo = document.getElementById('filtroPeriodo');
  const filtroEstadoPago = document.getElementById('filtroEstadoPago');
  const tbodyPagos = document.querySelector('#tablaPagos tbody');
  const tbodyResumen = document.querySelector('#tablaResumen tbody');

  const btnNuevoPago = document.getElementById('btnNuevoPago');
  const btnExportarPagos = document.getElementById('btnExportarPagos');

  // Modal pago
  const modalPago = document.getElementById('modalPago');
  const formPago = document.getElementById('formPago');
  const cerrarModalPago = document.getElementById('cerrarModalPago');
  const cancelarPago = document.getElementById('btnCancelarPago');
  const pagoId = document.getElementById('pagoId');
  const fechaPago = document.getElementById('fechaPago');
  const deportistaPago = document.getElementById('deportistaPago');
  const conceptoPago = document.getElementById('conceptoPago');
  const periodoPago = document.getElementById('periodoPago');
  const montoPago = document.getElementById('montoPago');
  const estadoPago = document.getElementById('estadoPago');

  function renderPagos(){
    const per = filtroPeriodo.value; const est = filtroEstadoPago.value;
    const data = pagos.filter(p=>{ if(per && p.periodo!==per) return false; if(est && p.estado!==est) return false; return true; });

    tbodyPagos.innerHTML = data.map(p=>{
      const badge = p.estado==='Pagado' ? '<span class="badge success">Pagado</span>' : '<span class="badge warning">Pendiente</span>';
      return `<tr>
        <td>${p.codigo}</td>
        <td>${p.fecha}</td>
        <td>${p.deportista}</td>
        <td>${p.concepto}</td>
        <td>${p.periodo||'-'}</td>
        <td>$${(p.monto||0).toLocaleString('es-CO')}</td>
        <td>${badge}</td>
        <td>
          <button class="btn" data-action="edit" data-id="${p.id}">Editar</button>
          <button class="btn" data-action="invoice" data-id="${p.id}">Factura</button>
          <button class="btn danger" data-action="delete" data-id="${p.id}">Eliminar</button>
        </td>
      </tr>`
    }).join('');

    renderResumen();
  }

  function renderResumen(){
    const groups = pagos.reduce((acc,p)=>{
      const k = p.periodo || 'N/A';
      if(!acc[k]) acc[k]=[]; acc[k].push(p); return acc;
    },{});

    const rows = Object.entries(groups).map(([periodo,items])=>{
      const ingresos = items.filter(i=>i.estado==='Pagado').reduce((s,i)=> s + (i.monto||0), 0);
      const pendiente = items.filter(i=>i.estado==='Pendiente').reduce((s,i)=> s + (i.monto||0), 0);
      return {periodo, ingresos, pendiente, count: items.length};
    });

    tbodyResumen.innerHTML = rows.map(r=>`
      <tr>
        <td>${r.periodo}</td>
        <td>$${r.ingresos.toLocaleString('es-CO')}</td>
        <td>$${r.pendiente.toLocaleString('es-CO')}</td>
        <td>${r.count}</td>
      </tr>
    `).join('');
  }

  function resetPagoForm(){ formPago.reset(); pagoId.value=''; clearErrors(formPago); }
  function fillDeportistas(){ deportistaPago.innerHTML = deportistas.map(d=>`<option value="${d.id}">${d.nombre}</option>`).join(''); }

  function openCreatePago(){ resetPagoForm(); fillDeportistas(); openModal(modalPago); }
  function openEditPago(id){ const p = pagos.find(x=>x.id===id); if(!p) return; resetPagoForm(); fillDeportistas(); pagoId.value=p.id; fechaPago.value=p.fecha; deportistaPago.value=p.deportistaId; conceptoPago.value=p.concepto; periodoPago.value=p.periodo||''; montoPago.value=p.monto||0; estadoPago.value=p.estado; openModal(modalPago); }

  function validatePago(){ clearErrors(formPago); let ok=true; const req=[['fechaPago',fechaPago.value],['deportistaPago',deportistaPago.value]]; req.forEach(([id,val])=>{ if(!val){ setError(formPago,id,'Campo requerido'); ok=false; }}); if(montoPago.value && Number(montoPago.value)<0){ setError(formPago,'montoPago','Monto inválido'); ok=false; } return ok; }
  function submitPago(e){ e.preventDefault(); if(!validatePago()) return; const dep = deportistas.find(d=>d.id===deportistaPago.value); const payload={ id: pagoId.value||GlobalStore.nextId('PAG'), codigo: pagoId.value? pagos.find(p=>p.id===pagoId.value)?.codigo : generarCodigoFactura(), fecha: fechaPago.value, deportistaId: dep.id, deportista: dep.nombre, concepto: conceptoPago.value, periodo: periodoPago.value||'', monto: Number(montoPago.value||0), estado: estadoPago.value }; if(pagoId.value){ const idx = pagos.findIndex(x=>x.id===pagoId.value); if(idx>-1) pagos[idx]={...pagos[idx], ...payload}; } else { pagos.push(payload); } closeModal(modalPago); renderPagos(); }

  function generarCodigoFactura(){
    const year = new Date().getFullYear();
    const seq = String(pagos.length + 1).padStart(4,'0');
    return `FAC-${year}-${seq}`;
  }

  function abrirFactura(id){ const p = pagos.find(x=>x.id===id); if(!p) return; const win = window.open('', '_blank'); const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>${p.codigo}</title><style>body{font-family:Arial,Helvetica,sans-serif;padding:20px;} h2{margin:0 0 10px;} .meta{margin:6px 0;} table{width:100%;border-collapse:collapse;margin-top:16px;} th,td{border:1px solid #ddd;padding:8px;text-align:left;} th{background:#f5f5f5;} .right{text-align:right;} .tot{font-weight:bold;}</style></head><body><h2>Academia de Fútbol - Factura</h2><div class="meta">Código: <strong>${p.codigo}</strong></div><div class="meta">Fecha: ${p.fecha}</div><div class="meta">Cliente: ${p.deportista}</div><table><thead><tr><th>Concepto</th><th>Periodo</th><th class="right">Monto</th></tr></thead><tbody><tr><td>${p.concepto}</td><td>${p.periodo||'-'}</td><td class="right">$${(p.monto||0).toLocaleString('es-CO')}</td></tr></tbody><tfoot><tr><td colspan="2" class="right tot">Total</td><td class="right tot">$${(p.monto||0).toLocaleString('es-CO')}</td></tr></tfoot></table><script>window.print()</script></body></html>`; win.document.write(html); win.document.close(); }

  function removePago(id){ pagos = pagos.filter(p=>p.id!==id); renderPagos(); }

  function exportCSV(){ const headers=[ {label:'Código', value:r=>r.codigo}, {label:'Fecha', value:r=>r.fecha}, {label:'Deportista', value:r=>r.deportista}, {label:'Concepto', value:r=>r.concepto}, {label:'Periodo', value:r=>r.periodo}, {label:'Monto', value:r=>r.monto}, {label:'Estado', value:r=>r.estado} ]; const csv = toCSV(headers, pagos); download(`pagos_${Date.now()}.csv`, csv, 'text/csv;charset=utf-8'); }

  // Eventos
  btnNuevoPago.addEventListener('click', openCreatePago);
  btnExportarPagos.addEventListener('click', exportCSV);
  filtroPeriodo.addEventListener('change', renderPagos);
  filtroEstadoPago.addEventListener('change', renderPagos);

  cerrarModalPago.addEventListener('click', ()=> closeModal(modalPago));
  cancelarPago.addEventListener('click', ()=> closeModal(modalPago));
  formPago.addEventListener('submit', submitPago);

  tbodyPagos.addEventListener('click', (e)=>{
    const btn = e.target.closest('button[data-action]'); if(!btn) return; const id=btn.dataset.id; const a=btn.dataset.action;
    if(a==='edit') openEditPago(id);
    if(a==='delete') confirmDialog({title:'Eliminar pago', message:'¿Eliminar el pago?', onAccept:()=> removePago(id)});
    if(a==='invoice') abrirFactura(id);
  });

  // Init
  renderPagos(); fillDeportistas();
})();
