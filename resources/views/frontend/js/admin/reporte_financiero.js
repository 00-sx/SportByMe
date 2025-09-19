document.addEventListener('DOMContentLoaded', function() {
            const aplicarFiltrosBtn = document.getElementById('btn-aplicar-filtros');

            if (aplicarFiltrosBtn) {
                aplicarFiltrosBtn.addEventListener('click', function() {
                    // Simulación de funcionalidad
                    showToast('Filtros aplicados. Actualizando reporte...');
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