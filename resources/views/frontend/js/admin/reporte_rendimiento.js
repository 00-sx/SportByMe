document.addEventListener('DOMContentLoaded', function() {
            document.getElementById('btn-aplicar-filtros-rendimiento')?.addEventListener('click', function() {
                showToast('Filtros aplicados. Actualizando reporte de rendimiento...');
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