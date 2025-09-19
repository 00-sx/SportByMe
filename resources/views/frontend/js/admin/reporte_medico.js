 document.addEventListener('DOMContentLoaded', function() {
            document.getElementById('btn-imprimir-historial')?.addEventListener('click', function() {
                // Simulación de funcionalidad
                showToast('Generando PDF del historial médico...');
            });

            function showToast(message) {
                const toastContainer = document.getElementById('toast-container');
                if (!toastContainer) return;
                const toast = document.createElement('div');
                toast.className = 'toast show';
                toast.textContent = message;
                toastContainer.appendChild(toast);
                setTimeout(() => { toast.remove(); }, 3000);
            }
        });