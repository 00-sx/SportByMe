 document.addEventListener('DOMContentLoaded', function() {
            // --- Lógica para las Pestañas (Tabs) ---
            const tabs = document.querySelectorAll('.tab-link');
            const contents = document.querySelectorAll('.tab-content');
            tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    tabs.forEach(item => item.classList.remove('active'));
                    contents.forEach(item => item.classList.remove('active'));
                    tab.classList.add('active');
                    document.getElementById(tab.getAttribute('data-tab')).classList.add('active');
                });
            });

            // --- Lógica Genérica para controlar todos los Modales ---
            function setupModal(buttonId, modalId, formId, successMessage) {
                const modal = document.getElementById(modalId);
                if (!modal) return;
                const openBtn = document.getElementById(buttonId);
                const closeBtn = modal.querySelector('.close-modal');
                const form = document.getElementById(formId);

                if (openBtn) openBtn.addEventListener('click', () => modal.style.display = 'flex');
                
                const closeModal = () => modal.style.display = 'none';
                
                if (closeBtn) closeBtn.addEventListener('click', closeModal);
                modal.addEventListener('click', (event) => {
                    if (event.target === modal) closeModal();
                });

                if (form) form.addEventListener('submit', (event) => {
                    event.preventDefault();
                    closeModal();
                    showToast(successMessage);
                    form.reset();
                });
            }
            
            setupModal('btn-crear-cobro', 'modal-crear-cobro', 'form-crear-cobro', 'Item de cobro añadido con éxito.');
            setupModal('btn-crear-categoria', 'modal-crear-categoria', 'form-crear-categoria', 'Categoría creada con éxito.');
            setupModal('btn-crear-rol', 'modal-crear-rol', 'form-crear-rol', 'Rol creado con éxito.');

            // --- Lógica para la interactividad de Roles y Permisos ---
            const rolesTableBody = document.getElementById('roles-table-body');
            const selectedRoleNameSpan = document.getElementById('selected-role-name');
            const permissionsCheckboxes = document.querySelectorAll('#permissions-container input[type="checkbox"]');
            const permissionsByRole = {
                'Administradora': ['perm-usuarios', 'perm-pagos', 'perm-planes', 'perm-torneos', 'perm-reportes'],
                'Director Deportivo': ['perm-planes', 'perm-torneos', 'perm-reportes'],
                'Entrenador': ['perm-reportes']
            };

            if (rolesTableBody) rolesTableBody.addEventListener('click', (event) => {
                const clickedRow = event.target.closest('tr');
                if (!clickedRow) return;

                rolesTableBody.querySelectorAll('tr').forEach(row => row.classList.remove('selected'));
                clickedRow.classList.add('selected');

                const roleName = clickedRow.getAttribute('data-name');
                const rolePermissions = permissionsByRole[roleName] || [];

                selectedRoleNameSpan.textContent = roleName;
                permissionsCheckboxes.forEach(checkbox => {
                    checkbox.checked = rolePermissions.includes(checkbox.name);
                });
            });

            // --- Lógica para las Notificaciones "Toast" ---
            function showToast(message) {
                const toastContainer = document.getElementById('toast-container');
                const toast = document.createElement('div');
                toast.className = 'toast show';
                toast.textContent = message;
                toastContainer.appendChild(toast);
                setTimeout(() => { toast.remove(); }, 3000);
            }
        });