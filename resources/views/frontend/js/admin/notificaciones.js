
        document.addEventListener('DOMContentLoaded', function() {
            // --- DATOS DE EJEMPLO ---
            const inboxMessages = [
                { id: 1, sender: 'Ana Martínez (Acudiente)', subject: 'Justificación Ausencia', snippet: '- Hola, escribo para justificar la ausencia...', body: 'Hola, escribo para justificar la ausencia de mi hijo Carlos al entrenamiento de hoy por una cita médica.', date: '17 Jun, 2025', unread: true },
                { id: 2, sender: 'Juan González (Entrenador)', subject: 'Reporte de Lesión', snippet: '- Durante el entrenamiento de hoy...', body: 'Durante el entrenamiento de hoy, el deportista #9 se torció el tobillo. Se le aplicó hielo y se recomendó reposo.', date: '16 Jun, 2025', unread: true },
            ];
            const sentMessages = [
                { id: 4, recipient: 'Todos los Acudientes', subject: 'Convocatoria Reunión Anual', snippet: '- Se les convoca a la reunión anual...', body: 'Se les convoca a la reunión anual de padres el día 30 de Junio a las 7:00 PM.', date: '14 Jun, 2025' }
            ];

            const listView = document.getElementById('notifications-list-view');
            const detailView = document.getElementById('notification-detail-view');
            const backBtn = document.getElementById('back-to-list-btn');
            const folders = document.querySelectorAll('.folder-item');

            function renderListView(folder) {
                let messages = folder === 'inbox' ? inboxMessages : sentMessages;
                let html = '';
                messages.forEach(msg => {
                    const unreadClass = msg.unread ? 'unread' : '';
                    html += `<div class="notification-item ${unreadClass}" data-id="${msg.id}"><div class="notification-sender">${msg.sender || msg.recipient}</div><div class="notification-subject">${msg.subject}</div><div class="notification-snippet">${msg.snippet}</div><div class="notification-date">${msg.date}</div></div>`;
                });
                listView.innerHTML = html;
                detailView.style.display = 'none';
                listView.style.display = 'block';
                document.querySelectorAll('.notification-item').forEach(item => {
                    item.addEventListener('click', () => showDetailView(parseInt(item.dataset.id)));
                });
            }

            function showDetailView(messageId) {
                const message = inboxMessages.find(m => m.id === messageId) || sentMessages.find(m => m.id === messageId);
                if (!message) return;
                if(message.unread) message.unread = false;
                
                detailView.innerHTML = `<button id="back-to-list-btn" class="btn btn-secondary"><i class="fas fa-arrow-left"></i> Volver</button><hr><h3 id="detail-subject">${message.subject}</h3><div id="detail-meta" class="detail-meta"><strong>De:</strong> ${message.sender || 'Yo'}<br><strong>Para:</strong> ${message.recipient || 'Mí'}</div><div id="detail-body" class="detail-body">${message.body}</div>`;
                document.getElementById('back-to-list-btn').addEventListener('click', () => renderListView(document.querySelector('.folder-item.active').dataset.folder));
                
                listView.style.display = 'none';
                detailView.style.display = 'block';
            }

            folders.forEach(folder => {
                folder.addEventListener('click', () => {
                    folders.forEach(f => f.classList.remove('active'));
                    folder.classList.add('active');
                    renderListView(folder.dataset.folder);
                });
            });

            renderListView('inbox');
            
            const modal = document.getElementById('compose-modal');
            const composeBtn = document.getElementById('compose-btn');
            const closeModalBtn = modal.querySelector('.close-modal');
            composeBtn.addEventListener('click', () => { modal.style.display = 'flex'; });
            closeModalBtn.addEventListener('click', () => { modal.style.display = 'none'; });
            modal.addEventListener('click', (event) => { if (event.target === modal) modal.style.display = 'none'; });
        });