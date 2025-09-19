document.addEventListener('DOMContentLoaded', function() {
            function setupModal(buttonId, modalId, formId, successMessage) {
                const modal = document.getElementById(modalId); if (!modal) return;
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
            function showToast(message) {
                const toastContainer = document.getElementById('toast-container');
                const toast = document.createElement('div');
                toast.className = 'toast show';
                toast.textContent = message;
                toastContainer.appendChild(toast);
                setTimeout(() => { toast.remove(); }, 3000);
            }
            setupModal('btn-registrar-pago', 'modal-registrar-pago', 'form-registrar-pago', 'Pago registrado con éxito.');
            const itemsContainer = document.getElementById('payment-items-container');
            const addBtn = document.getElementById('add-payment-item');
            const totalAmountSpan = document.getElementById('payment-total-amount');
            const catalogo = [{ id: 1, nombre: 'Inscripción Anual', precio: 100000 },{ id: 2, nombre: 'Evaluación Médica', precio: 55000 },{ id: 4, nombre: 'Uniforme Oficial', precio: 60000 }];
            let itemCounter = 0;
            const createPaymentItem = () => {
                itemCounter++;
                const itemDiv = document.createElement('div');
                itemDiv.className = 'payment-item-row';
                itemDiv.innerHTML = `<select class="item-select" data-id="${itemCounter}"><option value="">-- Seleccione un producto --</option>${catalogo.map(p => `<option value="${p.id}" data-precio="${p.precio}">${p.nombre}</option>`).join('')}</select><input type="number" class="item-qty" value="1" min="1" data-id="${itemCounter}"><span class="item-subtotal">$0</span><button type="button" class="btn-remove-item">&times;</button>`;
                itemsContainer.appendChild(itemDiv);
                itemDiv.querySelector('.item-select').addEventListener('change', updateTotals);
                itemDiv.querySelector('.item-qty').addEventListener('input', updateTotals);
                itemDiv.querySelector('.btn-remove-item').addEventListener('click', () => { itemDiv.remove(); updateTotals(); });
            };
            const updateTotals = () => {
                let total = 0;
                document.querySelectorAll('.payment-item-row').forEach(row => {
                    const select = row.querySelector('.item-select');
                    const qtyInput = row.querySelector('.item-qty');
                    const subtotalSpan = row.querySelector('.item-subtotal');
                    const selectedOption = select.options[select.selectedIndex];
                    const price = parseFloat(selectedOption.dataset.precio || 0);
                    const qty = parseInt(qtyInput.value || 1);
                    const subtotal = price * qty;
                    subtotalSpan.textContent = `$${subtotal.toLocaleString('es-CO')}`;
                    total += subtotal;
                });
                totalAmountSpan.textContent = `$${total.toLocaleString('es-CO')}`;
            };
            addBtn.addEventListener('click', createPaymentItem);
            document.getElementById('btn-registrar-pago').addEventListener('click', () => {
                itemsContainer.innerHTML = '';
                createPaymentItem();
                updateTotals();
            });
        });