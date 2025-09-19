document.addEventListener('DOMContentLoaded', function() {
            const tabs = document.querySelectorAll('.tab-link');
            const contents = document.querySelectorAll('.tab-content');
            tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    tabs.forEach(item => item.classList.remove('active'));
                    contents.forEach(item => item.classList.remove('active'));
                    tab.classList.add('active');
                    document.getElementById(tab.dataset.tab).classList.add('active');
                });
            });
            document.getElementById('form-datos-personales').addEventListener('submit', (e) => { e.preventDefault(); mostrarMensaje('¡Datos actualizados con éxito!', 'success'); });
            document.getElementById('form-cambiar-contrasena').addEventListener('submit', (e) => { e.preventDefault(); mostrarMensaje('¡Contraseña cambiada con éxito!', 'success'); e.target.reset(); });
        });