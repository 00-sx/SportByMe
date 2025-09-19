

 document.addEventListener('DOMContentLoaded', function() {

    // --- Lógica para el Modal de Login ---
    const openModalBtn = document.getElementById('open-login-modal-btn');
    const closeModalBtn = document.getElementById('close-login-modal-btn');
    const loginModal = document.getElementById('login-modal');
    const loginForm = document.getElementById('login-form');

    // Abrir modal
    if (openModalBtn) {
        openModalBtn.addEventListener('click', () => {
            if (loginModal) {
                loginModal.style.display = 'flex';
            }
        });
    }

    // Cerrar modal
    const closeModal = () => {
        if (loginModal) {
            loginModal.style.display = 'none';
        }
    };

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    
    if (loginModal) {
        loginModal.addEventListener('click', (event) => {
            if (event.target === loginModal) {
                closeModal();
            }
        });
    }

    // --- Lógica del Formulario de Login por ROL ---
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault(); 

            const username = document.getElementById('username').value.trim();
            const role = document.getElementById('role').value;

            // Mapear roles a sus páginas
            const rolePages = {
                'admin': 'Administrador/dashboard.html',
                'entrenador': 'Entrenador/entrenador_dashboard.html',
                'deportista': 'Deportista/dashboard_deportista.html',
                'acudiente': 'Acudiente/acudiente_dashboard.html'
            };

            const redirectTo = rolePages[role];

            if (redirectTo) {
                alert(`Bienvenido ${role.charAt(0).toUpperCase() + role.slice(1)} ${username}`);
                window.location.href = redirectTo;
            } else {
                alert('Selecciona un rol válido.');
            }
        });
    }
});
