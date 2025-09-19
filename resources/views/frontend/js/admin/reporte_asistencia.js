document.addEventListener('DOMContentLoaded', function() {
            const aplicarFiltrosBtn = document.getElementById('btn-aplicar-filtros');

            if (aplicarFiltrosBtn) {
                aplicarFiltrosBtn.addEventListener('click', function() {
                    // Simulación: En una app real, aquí se enviarían los filtros al backend.
                    // Por ahora, solo mostramos una confirmación.
                    showToast('Filtros aplicados con éxito.');
                });
            }

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