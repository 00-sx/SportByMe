document.addEventListener('DOMContentLoaded', function() {
        // --- DATOS DE EJEMPLO ---
        // En una aplicación real, estos datos vendrían de la base de datos
        const messages = [
            { 
                id: 1, 
                sender: 'Juan González (Entrenador)', 
                subject: 'Desempeño destacado de Carlos', 
                snippet: 'Quería felicitar a Carlos por su gran partido...', 
                body: 'Hola Ana,\n\nQuería felicitar a Carlos por su gran partido el fin de semana. Demostró mucho compromiso y anotó dos goles decisivos.\n\n¡Sigan así!\n\nSaludos,\nJuan González.',
                date: 'Hace 2 días', 
                unread: true 
            },
            { 
                id: 2, 
                sender: 'María López (Fisioterapeuta)', 
                subject: 'Recordatorio de cuidados post-entrenamiento', 
                snippet: 'No olviden los ejercicios de estiramiento...', 
                body: 'Hola Ana,\n\nSolo un recordatorio para que Carlos no olvide los ejercicios de estiramiento para su rodilla después de cada entrenamiento. Es clave para prevenir recaídas.\n\nCualquier consulta, no dudes en contactarme.\n\nGracias,\nMaría López.',
                date: 'Hace 1 semana', 
                unread: false
            },
            { 
                id: 3, 
                sender: 'Administración', 
                subject: 'Información sobre reunión de padres', 
                snippet: 'Les recordamos que la reunión trimestral...',
                body: 'Estimados padres y acudientes,\n\nLes recordamos que la reunión trimestral de padres y acudientes será el próximo viernes a las 6:00 PM en la sede del club.\n\nSu asistencia es muy importante.\n\nAtentamente,\nAdministración Club Tricolor.',
                date: 'Hace 2 semanas', 
                unread: false 
            }
        ];

        const listView = document.getElementById('notifications-list-view');
        const detailView = document.getElementById('notification-detail-view');

        function renderListView() {
            let html = '';
            messages.forEach(msg => {
                const unreadClass = msg.unread ? 'unread' : '';
                html += `<div class="notification-item ${unreadClass}" data-id="${msg.id}">
                            <div class="notification-sender">${msg.sender}</div>
                            <div class="notification-subject">${msg.subject}</div>
                            <div class="notification-snippet">${msg.snippet}</div>
                            <div class="notification-date">${msg.date}</div>
                        </div>`;
            });
            listView.innerHTML = html;
            detailView.style.display = 'none';
            listView.style.display = 'block';

            // Añadir event listeners a los nuevos items de la lista
            document.querySelectorAll('.notification-item').forEach(item => {
                item.addEventListener('click', () => {
                    showDetailView(parseInt(item.dataset.id));
                });
            });
        }

        function showDetailView(messageId) {
            const message = messages.find(m => m.id === messageId);
            if (!message) return;

            // Marcar como leído
            message.unread = false;
            
            // Actualizar la vista de detalle
            detailView.innerHTML = `
                <button id="back-to-list-btn" class="btn btn-secondary"><i class="fas fa-arrow-left"></i> Volver a la bandeja</button>
                <hr>
                <h3 id="detail-subject">${message.subject}</h3>
                <div id="detail-meta" class="detail-meta">
                    <strong>De:</strong> ${message.sender}<br>
                    <strong>Fecha:</strong> ${message.date}
                </div>
                <div id="detail-body" class="detail-body">${message.body}</div>
            `;
            
            // Añadir event listener al botón de "Volver"
            document.getElementById('back-to-list-btn').addEventListener('click', renderListView);
            
            // Ocultar la lista y mostrar el detalle
            listView.style.display = 'none';
            detailView.style.display = 'block';
        }

        // Carga inicial de la lista de mensajes
        renderListView();
    });