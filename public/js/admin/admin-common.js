/* Utilidades comunes para módulos del Administrador (datos estáticos) */
(function(){
  // Estado simple para simular almacenamiento en memoria por página
  const GlobalStore = {
    seq: 1,
    nextId(prefix='ID'){
      const id = `${prefix}-${Date.now()}-${GlobalStore.seq++}`;
      return id;
    }
  };

  function openModal(el){
    if(!el) return; el.classList.remove('hidden'); el.setAttribute('aria-hidden','false');
  }
  function closeModal(el){
    if(!el) return; el.classList.add('hidden'); el.setAttribute('aria-hidden','true');
  }

  function serializeForm(form){
    const data = {};
    Array.from(form.elements).forEach(el=>{
      if(!el.name && !el.id) return;
      const key = el.name || el.id;
      if(el.type === 'checkbox') data[key] = el.checked; else data[key] = el.value.trim();
    });
    return data;
  }

  function clearErrors(form){
    form.querySelectorAll('.error').forEach(e=> e.textContent = '');
  }
  function setError(form, fieldId, message){
    const small = form.querySelector(`.error[data-error-for="${fieldId}"]`);
    if(small) small.textContent = message || '';
  }

  function validateEmail(email){
    return /(^[^\s@]+@[^\s@]+\.[^\s@]+$)/.test(email);
  }

  function toCSV(headers, rows){
    const esc = v => `"${String(v ?? '').replace(/"/g,'""')}"`;
    const headerLine = headers.map(h=> esc(h.label)).join(',');
    const lines = rows.map(r => headers.map(h=> esc(h.value(r))).join(','));
    return [headerLine, ...lines].join('\r\n');
  }

  function download(filename, content, mime='text/plain;charset=utf-8'){
    const blob = new Blob([content], {type:mime});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(()=>{
      URL.revokeObjectURL(a.href); a.remove();
    }, 0);
  }

  function formatDate(d){
    const dt = (d instanceof Date) ? d : new Date(d);
    const pad = n => String(n).padStart(2,'0');
    return `${dt.getFullYear()}-${pad(dt.getMonth()+1)}-${pad(dt.getDate())}`;
  }

  function formatDateTime(d){
    const dt = (d instanceof Date) ? d : new Date(d);
    const pad = n => String(n).padStart(2,'0');
    return `${formatDate(dt)} ${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
  }

  function confirmDialog({title='Confirmar', message='¿Está seguro?', onAccept, onCancel}={}){
    const modal = document.getElementById('modalConfirm');
    if(!modal) return;
    const titulo = modal.querySelector('#modalConfirmTitulo');
    const msg = modal.querySelector('#modalConfirmMensaje');
    const btnAceptar = modal.querySelector('#btnAceptarConfirm');
    const btnCancelar = modal.querySelector('#btnCancelarConfirm');
    const btnCerrar = modal.querySelector('#cerrarModalConfirm');

    titulo.textContent = title; msg.textContent = message;

    const clean = ()=>{
      btnAceptar.replaceWith(btnAceptar.cloneNode(true));
      btnCancelar.replaceWith(btnCancelar.cloneNode(true));
      btnCerrar.replaceWith(btnCerrar.cloneNode(true));
      closeModal(modal);
    };

    openModal(modal);

    modal.querySelector('#btnAceptarConfirm').addEventListener('click', ()=>{ try{ onAccept && onAccept(); } finally { clean(); } });
    modal.querySelector('#btnCancelarConfirm').addEventListener('click', ()=>{ try{ onCancel && onCancel(); } finally { clean(); } });
    modal.querySelector('#cerrarModalConfirm').addEventListener('click', ()=>{ try{ onCancel && onCancel(); } finally { clean(); } });
  }

  // Expose as global
  window.AdminCommon = {
    GlobalStore,
    openModal,
    closeModal,
    serializeForm,
    clearErrors,
    setError,
    validateEmail,
    toCSV,
    download,
    formatDate,
    formatDateTime,
    confirmDialog,
  };
})();
