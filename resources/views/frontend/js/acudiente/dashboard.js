// --- Lógica para Pestañas ---
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


    document.addEventListener('DOMContentLoaded', function() {
        // --- SIMULACIÓN DE DATOS AMPLIADA ---
        const datosDeportistas = {
            '1': { // Datos para Carlos Martínez (ID 1)
                nombre: 'Carlos Martínez',
                widgets: {
                    proximoPartido: { valor: '10 JUN', detalle: '15:00 hs vs. Equipo B' },
                    estadoPago: { valor: 'Al día', detalle: 'Sin pagos pendientes', color: '#2ecc71' },
                    asistencia: { valor: '100%', detalle: 'Última semana' },
                    estadoMedico: { valor: 'Activo', detalle: 'Sin restricciones médicas', color: '#2ecc71' }
                },
                pagos: [
                    { ref: 'TXN123456', fecha: '01-04-2024', concepto: 'Inscripción Anual', monto: 100.00, estado: 'Completado' }
                ],
                estadisticas: { partidos: 1, minutos: 90, goles: 2, calificacion: 8.5 },
                historialMedico: [
                    { tipo: 'Evaluación inicial', fecha: '2024-04-05', motivo: 'Dolor en rodilla derecha tras entrenamiento', diagnostico: 'Tendinitis rotuliana', profesional: 'María López' }
                ]
            },
            '2': { // Datos de ejemplo para Laura Martínez (ID 2)
                nombre: 'Laura Martínez',
                widgets: {
                    proximoPartido: { valor: '12 JUN', detalle: '10:00 hs vs. Equipo Femenino' },
                    estadoPago: { valor: 'Pendiente', detalle: 'Mensualidad Junio', color: '#f1c40f' },
                    asistencia: { valor: '85%', detalle: 'Último mes' },
                    estadoMedico: { valor: 'En Observación', detalle: 'Molestia en tobillo', color: '#f1c40f' }
                },
                pagos: [
                    { ref: 'TXN555666', fecha: '01-05-2024', concepto: 'Mensualidad Mayo', monto: 55.00, estado: 'Completado' }
                ],
                estadisticas: { partidos: 2, minutos: 150, goles: 0, calificacion: 7.0 },
                historialMedico: [
                     { tipo: 'Control', fecha: '2024-05-20', motivo: 'Seguimiento de lesión de tobillo.', diagnostico: 'Esguince de tobillo grado 1', profesional: 'María López' }
                ]
            }
        };

        const selector = document.getElementById('deportista-selector');
        
        // --- FUNCIONES PARA RENDERIZAR CADA PESTAÑA ---
        function renderHistorialPagos(pagos) {
            let html = `<h4>Historial de Transacciones</h4>
                        <table class="data-table">
                            <thead><tr><th>Referencia</th><th>Fecha</th><th>Concepto</th><th>Monto</th><th>Estado</th></tr></thead>
                            <tbody>`;
            pagos.forEach(p => {
                html += `<tr>
                            <td>${p.ref}</td>
                            <td>${p.fecha}</td>
                            <td>${p.concepto}</td>
                            <td>$${p.monto.toFixed(2)}</td>
                            <td><span class="status-badge status-completed">${p.estado}</span></td>
                         </tr>`;
            });
            html += `</tbody></table>`;
            document.getElementById('historialPagos').innerHTML = html;
        }

        function renderEstadisticas(stats) {
            document.getElementById('estadisticasDeportista').innerHTML = `
                <h4>Rendimiento General</h4>
                <div class="summary-card-row">
                    <div class="summary-card"><span class="summary-title">Partidos Jugados</span><span class="summary-value">${stats.partidos}</span></div>
                    <div class="summary-card"><span class="summary-title">Minutos Totales</span><span class="summary-value">${stats.minutos}'</span></div>
                    <div class="summary-card"><span class="summary-title">Goles</span><span class="summary-value">${stats.goles}</span></div>
                    <div class="summary-card"><span class="summary-title">Calificación Prom.</span><span class="summary-value">${stats.calificacion}</span></div>
                </div>`;
        }
        
        function renderHistorialMedico(registros) {
            let html = '<h4>Historial de Registros Médicos</h4><div class="medical-history-container">';
            registros.forEach(r => {
                html += `<div class="medical-record-entry">
                            <div class="record-header">
                                <span><strong>Tipo:</strong> ${r.tipo}</span>
                                <span><strong>Fecha:</strong> ${r.fecha}</span>
                            </div>
                            <div class="record-body">
                                <p><strong>Profesional:</strong> ${r.profesional}</p>
                                <p><strong>Motivo:</strong> ${r.motivo}</p>
                                <p><strong>Diagnóstico:</strong> ${r.diagnostico}</p>
                            </div>
                         </div>`;
            });
            html += '</div>';
            document.getElementById('historialMedico').innerHTML = html;
        }


        // --- FUNCIÓN PRINCIPAL PARA ACTUALIZAR TODO EL PANEL ---
        function updateDashboard(deportistaId) {
            const datos = datosDeportistas[deportistaId];
            if (!datos) return;

            // 1. Actualizar título de la página
            document.getElementById('page-title-deportista').textContent = `Resumen de ${datos.nombre}`;
            
            // 2. Actualizar widgets superiores
            const widgets = datos.widgets;
            document.getElementById('widget-partido-valor').textContent = widgets.proximoPartido.valor;
            document.getElementById('widget-partido-detalle').innerHTML = `<i class="fas fa-clock"></i> ${widgets.proximoPartido.detalle}`;
            const pagoValorEl = document.getElementById('widget-pago-valor');
            pagoValorEl.textContent = widgets.estadoPago.valor;
            pagoValorEl.style.color = widgets.estadoPago.color;
            document.getElementById('widget-pago-detalle').innerHTML = `<i class="fas fa-file-invoice"></i> ${widgets.estadoPago.detalle}`;
            document.getElementById('widget-asistencia-valor').textContent = widgets.asistencia.valor;
            document.getElementById('widget-asistencia-detalle').innerHTML = `<i class="fas fa-user-check"></i> ${widgets.asistencia.detalle}`;
            const medicoValorEl = document.getElementById('widget-medico-valor');
            medicoValorEl.textContent = widgets.estadoMedico.valor;
            medicoValorEl.style.color = widgets.estadoMedico.color;
            document.getElementById('widget-medico-detalle').innerHTML = `<i class="fas fa-heartbeat"></i> ${widgets.estadoMedico.detalle}`;

            // 3. Renderizar el contenido de las pestañas
            renderHistorialPagos(datos.pagos);
            renderEstadisticas(datos.estadisticas);
            renderHistorialMedico(datos.historialMedico);

            // 4. Asegurarse de que la pestaña correcta esté visible
            document.querySelector('.tab-link.active').click();
        }

        // --- EVENT LISTENER PARA EL SELECTOR ---
        selector.addEventListener('change', function() {
            updateDashboard(this.value);
        });

        // --- CARGA INICIAL DEL DASHBOARD ---
        updateDashboard(selector.value);
    });