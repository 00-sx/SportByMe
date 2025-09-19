// Función para mostrar notificaciones toast
        function showToast(message) {
            const toastContainer = document.getElementById('toast-container');
            const toast = document.createElement('div');
            toast.className = 'toast show';
            toast.textContent = message;
            toastContainer.appendChild(toast);
            setTimeout(() => { toast.remove(); }, 3000);
        }

        document.addEventListener('DOMContentLoaded', function() {
            // Establecer la fecha de hoy por defecto en el campo de fecha
            document.getElementById('fecha_evaluacion').valueAsDate = new Date();

            // Simulación de guardado de la evaluación
            document.getElementById('form-crear-evaluacion').addEventListener('submit', function(e) {
                e.preventDefault();
                // En una aplicación real, aquí se enviarían los datos al backend
                showToast('¡Evaluación guardada con éxito!');
                
                // Opcional: Redirigir al perfil del deportista después de guardar
                setTimeout(() => {
                    window.location.href = 'perfil_deportista.html';
                }, 1500);
            });
        });