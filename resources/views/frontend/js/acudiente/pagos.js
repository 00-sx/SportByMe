// --- Lógica para Pestañas (sin cambios) ---
        function openTab(evt, tabName) {
            var i, tabcontent, tablinks;
            tabcontent = document.getElementsByClassName("tab-content");
            for (i = 0; i < tabcontent.length; i++) {
                tabcontent[i].style.display = "none";
                tabcontent[i].classList.remove("active");
            }
            tablinks = document.getElementsByClassName("tab-link");
            for (i = 0; i < tablinks.length; i++) {
                tablinks[i].className = tablinks[i].className.replace(" active", "");
            }
            document.getElementById(tabName).style.display = "block";
            document.getElementById(tabName).classList.add("active");
            evt.currentTarget.className += " active";
        }

        // --- Lógica para Notificaciones Toast (sin cambios) ---
        function showToast(message) {
            const container = document.getElementById('toast-container');
            const toast = document.createElement('div');
            toast.className = 'toast show';
            toast.textContent = message;
            container.appendChild(toast);
            setTimeout(() => { toast.remove(); }, 3000);
        }

        // --- NUEVA LÓGICA PARA LA FUNCIONALIDAD DE PAGOS ---
        document.addEventListener('DOMContentLoaded', function() {
            // 1. SIMULACIÓN DE DATOS (en una app real, esto vendría de una API/base de datos)
            let mockPayments = [
                { id: 1, ref: 'TXN123456', concepto: 'Inscripción Anual', monto: 100.00, estado: 'Completado', fecha: '2024-04-01' },
                { id: 2, ref: 'TXN998877', concepto: 'Mensualidad Junio', monto: 55.00, estado: 'Pendiente', fecha: '2025-06-15' },
            ];

            const pendingBody = document.getElementById('pending-payments-body');
            const completedBody = document.getElementById('completed-payments-body');

            // 2. FUNCIÓN PARA RENDERIZAR LAS TABLAS
            function renderTables() {
                // Limpiar tablas existentes
                pendingBody.innerHTML = '';
                completedBody.innerHTML = '';

                // Poblar tablas basadas en el estado del pago
                mockPayments.forEach(pago => {
                    if (pago.estado === 'Pendiente' || pago.estado === 'Vencido') {
                        const row = `<tr>
                            <td>${pago.ref}</td>
                            <td>${pago.fecha}</td>
                            <td>${pago.concepto}</td>
                            <td>$${pago.monto.toFixed(2)}</td>
                            <td><span class="status-badge status-pending">${pago.estado}</span></td>
                            <td><button class="btn btn-primary pay-now-btn" data-id="${pago.id}">Pagar Ahora</button></td>
                        </tr>`;
                        pendingBody.innerHTML += row;
                    } else if (pago.estado === 'Completado') {
                        const row = `<tr>
                            <td>${pago.ref}</td>
                            <td>${pago.fecha}</td>
                            <td>${pago.concepto}</td>
                            <td>$${pago.monto.toFixed(2)}</td>
                            <td><span class="status-badge status-completed">${pago.estado}</span></td>
                        </tr>`;
                        completedBody.innerHTML += row;
                    }
                });
                updateSummaryWidgets();
            }

            // 3. FUNCIÓN PARA ACTUALIZAR LOS WIDGETS DE RESUMEN
            function updateSummaryWidgets() {
                const totalPagado = mockPayments
                    .filter(p => p.estado === 'Completado')
                    .reduce((sum, p) => sum + p.monto, 0);
                
                const pagosPendientes = mockPayments.filter(p => p.estado === 'Pendiente' || p.estado === 'Vencido');

                const widgetEstado = document.getElementById('widget-estado-cuenta');
                const widgetTotal = document.getElementById('widget-total-pagado');
                
                // Actualizar widget de total pagado
                widgetTotal.querySelector('.value').textContent = `$${totalPagado.toFixed(2)}`;

                // Actualizar widget de estado de cuenta
                if (pagosPendientes.length > 0) {
                    widgetEstado.querySelector('.value').textContent = 'Pago Requerido';
                    widgetEstado.querySelector('.value').style.color = '#f1c40f'; // Amarillo
                    widgetEstado.querySelector('.details').textContent = `${pagosPendientes.length} pago(s) pendiente(s)`;
                } else {
                    widgetEstado.querySelector('.value').textContent = 'Al día';
                    widgetEstado.querySelector('.value').style.color = '#2ecc71'; // Verde
                    widgetEstado.querySelector('.details').textContent = 'Sin pagos pendientes';
                }
            }

            // 4. AÑADIR EVENT LISTENER PARA LOS BOTONES "PAGAR AHORA"
            pendingBody.addEventListener('click', function(event) {
                if (event.target.matches('.pay-now-btn')) {
                    const paymentId = parseInt(event.target.getAttribute('data-id'));
                    
                    if (confirm('Estás a punto de simular el pago de esta transacción. ¿Deseas continuar?')) {
                        // Encontrar el pago y actualizar su estado
                        const pago = mockPayments.find(p => p.id === paymentId);
                        if (pago) {
                            pago.estado = 'Completado';
                            pago.fecha = new Date().toISOString().split('T')[0]; // Fecha de hoy
                        }
                        
                        // Volver a renderizar todo
                        renderTables();
                        showToast('¡Pago simulado con éxito!');
                    }
                }
            });

            // --- INICIALIZACIÓN ---
            // Activar la primera pestaña por defecto al cargar la página
            document.querySelector('.tab-link.active').click();
            // Renderizar el contenido inicial
            renderTables();
        });