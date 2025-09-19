document.addEventListener('DOMContentLoaded', function() {
            // --- Lógica de Pestañas ---
            document.querySelectorAll('.tab-link').forEach(tab => {
                tab.addEventListener('click', () => {
                    document.querySelectorAll('.tab-link, .tab-content').forEach(item => item.classList.remove('active'));
                    tab.classList.add('active');
                    document.getElementById(tab.dataset.tab).classList.add('active');
                });
            });

            // --- FUNCIÓN HELPER para controlar todos los Modales ---
            function setupModal(buttonId, modalId) {
                const modal = document.getElementById(modalId);
                if (!modal) return;
                const openBtn = document.getElementById(buttonId);
                const closeBtns = modal.querySelectorAll('.close-modal');

                if (openBtn) openBtn.addEventListener('click', () => modal.style.display = 'flex');
                
                const closeModal = () => modal.style.display = 'none';
                
                closeBtns.forEach(btn => btn.addEventListener('click', closeModal));
                modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });
            }
            
            // --- FUNCIÓN HELPER para Notificaciones "Toast" ---
            function showToast(message) {
                const toastContainer = document.getElementById('toast-container');
                if (!toastContainer) return;
                const toast = document.createElement('div');
                toast.className = 'toast show';
                toast.textContent = message;
                toastContainer.appendChild(toast);
                setTimeout(() => { toast.remove(); }, 3000);
            }

            // --- Instanciamos los modales ---
            setupModal('btn-inscribir-equipo', 'modal-inscribir-equipo');
            setupModal('btn-generar-partidos', 'modal-generar-partidos');
            
            document.getElementById('form-inscribir-equipo')?.addEventListener('submit', e => { 
                e.preventDefault(); 
                showToast('Equipo inscrito con éxito.'); 
                document.getElementById('modal-inscribir-equipo').style.display = 'none'; 
            });
            document.getElementById('confirm-generar')?.addEventListener('click', () => { 
                showToast('Calendario de partidos generado.'); 
                document.getElementById('modal-generar-partidos').style.display = 'none'; 
            });

            // --- Lógica para Registrar/Guardar Resultados ---
            const matchListBody = document.getElementById('match-list-body');
            if(matchListBody) {
                matchListBody.addEventListener('click', function(event) {
                    const target = event.target;
                    
                    if (target.classList.contains('btn-register-result') || target.classList.contains('btn-save-result')) {
                        event.preventDefault();
                        const actionCell = target.closest('td');
                        if (!actionCell) return;
                        const resultCell = actionCell.previousElementSibling;
                        if (!resultCell) return;
                        
                        if (target.classList.contains('btn-register-result')) {
                            resultCell.querySelector('.result-display').style.display = 'none';
                            resultCell.querySelector('.result-edit').style.display = 'flex';
                            target.replaceWith(createSaveButton());
                        } else if (target.classList.contains('btn-save-result')) {
                            const inputs = resultCell.querySelectorAll('input');
                            const scoreLocal = inputs[0].value || '0';
                            const scoreVisitante = inputs[1].value || '0';
                            
                            resultCell.querySelector('.result-display').innerHTML = `<span>${scoreLocal} - ${scoreVisitante}</span>`;
                            resultCell.querySelector('.result-display').style.display = 'flex';
                            resultCell.querySelector('.result-edit').style.display = 'none';
                            target.replaceWith(createRegisterLink());
                            showToast('Resultado guardado con éxito.');
                        }
                    }
                });
            }

            function createSaveButton() { const btn = document.createElement('button'); btn.className = 'btn btn-secondary btn-save-result'; btn.textContent = 'Guardar'; return btn; }
            function createRegisterLink() { const link = document.createElement('a'); link.href = '#'; link.className = 'btn-register-result'; link.textContent = 'Editar Resultado'; return link; }
        });