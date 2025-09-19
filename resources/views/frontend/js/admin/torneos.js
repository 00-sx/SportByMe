document.addEventListener('DOMContentLoaded', function() {
    
    // --- Lógica reutilizable para el modal y el toast ---
    function setupModal(buttonId, modalId, formId, successMessage) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        const openBtn = document.getElementById(buttonId);
        const closeBtn = modal.querySelector('.close-modal');
        const form = document.getElementById(formId);

        // --- OBTENER ELEMENTOS DE FECHA DEL FORMULARIO ---
        const fechaInicioIns = modal.querySelector('#fecha-inicio-ins');
        const fechaFinIns = modal.querySelector('#fecha-fin-ins');
        const fechaInicioTorneo = modal.querySelector('#fecha-inicio-torneo');
        const fechaFinTorneo = modal.querySelector('#fecha-fin-torneo');

        if (openBtn) {
            openBtn.addEventListener('click', () => modal.style.display = 'flex');
        }
        
        const closeModal = () => modal.style.display = 'none';
        
        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }
        
        modal.addEventListener('click', (event) => {
            if (event.target === modal) closeModal();
        });

        // --- LÓGICA PARA MEJORAR LA EXPERIENCIA DE USUARIO CON LAS FECHAS ---
        if (fechaInicioIns) {
            fechaInicioIns.addEventListener('change', () => {
                // La fecha de fin de inscripción no puede ser antes que la de inicio
                if (fechaInicioIns.value) {
                    fechaFinIns.min = fechaInicioIns.value;
                }
            });
        }
        if (fechaFinIns) {
            fechaFinIns.addEventListener('change', () => {
                // El torneo no puede iniciar antes de que terminen las inscripciones
                if (fechaFinIns.value) {
                    fechaInicioTorneo.min = fechaFinIns.value;
                }
            });
        }
        if (fechaInicioTorneo) {
            fechaInicioTorneo.addEventListener('change', () => {
                // La fecha de fin del torneo no puede ser antes que su inicio
                if (fechaInicioTorneo.value) {
                    fechaFinTorneo.min = fechaInicioTorneo.value;
                }
            });
        }


        if (form) {
            form.addEventListener('submit', (event) => {
                event.preventDefault();

                // --- VALIDACIÓN DE FECHAS AL ENVIAR EL FORMULARIO ---
                const v_fechaInicioIns = new Date(fechaInicioIns.value);
                const v_fechaFinIns = new Date(fechaFinIns.value);
                const v_fechaInicioTorneo = new Date(fechaInicioTorneo.value);
                const v_fechaFinTorneo = new Date(fechaFinTorneo.value);

                if (v_fechaFinIns < v_fechaInicioIns) {
                    showToast('Error: La fecha de fin de inscripciones no puede ser anterior a la fecha de inicio.', true);
                    return; // Detiene el envío
                }
                
                if (v_fechaInicioTorneo < v_fechaFinIns) {
                    showToast('Error: El torneo no puede iniciar antes de que finalicen las inscripciones.', true);
                    return; // Detiene el envío
                }

                if (v_fechaFinTorneo < v_fechaInicioTorneo) {
                    showToast('Error: La fecha de fin del torneo no puede ser anterior a su fecha de inicio.', true);
                    return; // Detiene el envío
                }
                
                // Si todas las validaciones pasan:
                closeModal();
                showToast(successMessage);
                form.reset();
            });
        }
    }
            
    function showToast(message, isError = false) {
        const toastContainer = document.getElementById('toast-container');
        if (!toastContainer) return;
        const toast = document.createElement('div');
        toast.className = `toast show ${isError ? 'error' : ''}`;
        toast.textContent = message;
        toastContainer.appendChild(toast);
        setTimeout(() => { toast.remove(); }, 4000); // Duración 4 segundos
    }

    // Instanciar la lógica para el modal de crear torneo
    setupModal('btn-crear-torneo', 'modal-crear-torneo', 'form-crear-torneo', 'Torneo creado con éxito.');
});