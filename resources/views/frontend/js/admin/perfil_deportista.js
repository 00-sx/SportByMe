document.addEventListener('DOMContentLoaded', function() {
        // --- Lógica reutilizable para Modales y Toasts ---
        function showToast(message) {
            const toastContainer = document.getElementById('toast-container');
            const toast = document.createElement('div');
            toast.className = 'toast show';
            toast.textContent = message;
            toastContainer.appendChild(toast);
            setTimeout(() => { toast.remove(); }, 3000);
        }

        function setupModal(buttonId, modalId, formId, successMessage) {
            const modal = document.getElementById(modalId);
            if (!modal) return;
            const openBtn = document.getElementById(buttonId);
            const closeBtn = modal.querySelector('.close-modal');
            const form = document.getElementById(formId);

            if (openBtn) openBtn.addEventListener('click', () => modal.style.display = 'flex');
            
            const closeModal = () => modal.style.display = 'none';
            
            if (closeBtn) closeBtn.addEventListener('click', closeModal);
            modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });

            if (form) form.addEventListener('submit', (event) => {
                event.preventDefault();
                closeModal();
                showToast(successMessage);
                form.reset();
            });
        }
        
        // --- Lógica para Pestañas del Perfil ---
        document.querySelectorAll('.profile-main .tab-link').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.profile-main .tab-link, .profile-main .tab-content').forEach(item => item.classList.remove('active'));
                tab.classList.add('active');
                document.getElementById(tab.getAttribute('data-tab')).classList.add('active');
            });
        });

        // --- Lógica para el Acordeón de Evaluaciones ---
        document.querySelectorAll('.accordion-item').forEach(item => {
            const header = item.querySelector('.accordion-header');
            header.addEventListener('click', () => {
                item.classList.toggle('active');
            });
        });
        
        // --- Lógica para el modal de Asignar Acudiente ---
        setupModal('btn-asignar-acudiente', 'modal-asignar-acudiente', 'form-asignar-acudiente', 'Acudiente asignado con éxito.');
    });