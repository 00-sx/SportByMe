document.addEventListener('DOMContentLoaded', function() {
        // --- DATOS DE EJEMPLO para el deportista ---
        const mockMessages = [
            { 
                id: 1, 
                sender: 'Juan González (Entrenador)', 
                subject: 'Feedback del último partido', 
                snippet: 'Hola Carlos, buen partido. Tenemos que trabajar...', 
                body: 'Hola Carlos,\n\nBuen partido el del fin de semana. Mostraste mucha garra.\n\nEn el entrenamiento del miércoles vamos a enfocarnos en tu posicionamiento defensivo, que fue el único punto flojo que vi.\n\n¡Sigue con esa actitud!\n\nSaludos,\nJuan.',
                date: 'Hace 1 día', 
                unread: true 
            },
            { 
                id: 2, 
                sender: 'Administración Club', 
                subject: 'Cambio de Horario: Entrenamiento Viernes', 
                snippet: 'Atención: La sesión de entrenamiento del viernes...', 
                body: 'Atención equipo Juvenil,\n\nLa sesión de entrenamiento de este viernes se adelanta a las 15:00 hs debido a trabajos de mantenimiento en la cancha principal.\n\nPor favor, tomar nota.\n\nGracias,\nAdministración.',
                date: 'Hace 3 días', 
                unread: true 
            },
            { 
                id: 3, 
                sender: 'María López (Fisioterapeuta)', 
                subject: 'Ejercicios de Fortalecimiento', 
                snippet: 'Carlos, no olvides realizar la serie de ejercicios...',
                body: 'Hola Carlos,\n\nTe escribo para recordarte la importancia de realizar la serie de ejercicios para tu rodilla que te indiqué la semana pasada.\n\nLa constancia es clave para evitar que vuelva la tendinitis. Realízalos 3 veces por semana.\n\nCualquier molestia, avísame.\n\nCuídate,\nMaría.',
                date: 'Hace 1 semana', 
                unread: false 
            }
        ];

        const listView = document.getElementById('notifications-list-view');
        const detailView = document.getElementById('notification-detail-view');

        function renderListView() {
            let html = '';
            mockMessages.forEach(msg => {
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

            document.querySelectorAll('.notification-item').forEach(item => {
                item.addEventListener('click', () => {
                    showDetailView(parseInt(item.dataset.id));
                });
            });
        }

        function showDetailView(messageId) {
            const message = mockMessages.find(m => m.id === messageId);
            if (!message) return;
            message.unread = false;
            
            detailView.innerHTML = `
                <button id="back-to-list-btn" class="btn btn-secondary"><i class="fas fa-arrow-left"></i> Volver</button>
                <hr>
                <h3>${message.subject}</h3>
                <div class="detail-meta">
                    <strong>De:</strong> ${message.sender}<br>
                    <strong>Fecha:</strong> ${message.date}
                </div>
                <div class="detail-body">${message.body}</div>
            `;
            
            document.getElementById('back-to-list-btn').addEventListener('click', renderListView);
            
            listView.style.display = 'none';
            detailView.style.display = 'block';
        }

        renderListView();
    });