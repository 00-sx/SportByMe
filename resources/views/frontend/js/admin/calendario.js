document.addEventListener('DOMContentLoaded', function() {
    // --- Lógica del calendario (sin cambios) ---
    const weekRangeTitle = document.getElementById('week-range-title');
    const prevWeekBtn = document.getElementById('prev-week-btn');
    const nextWeekBtn = document.getElementById('next-week-btn');
    const dayColumns = document.querySelectorAll('.day-col .day-events');
    let currentDate = new Date('2025-06-16T00:00:00');

    function updateCalendar() {
        const weekStart = new Date(currentDate);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay() + (weekStart.getDay() === 0 ? -6 : 1));
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
        weekRangeTitle.textContent = `${weekStart.getDate()} de ${monthNames[weekStart.getMonth()]} - ${weekEnd.getDate()} de ${monthNames[weekEnd.getMonth()]}, ${weekEnd.getFullYear()}`;
        dayColumns.forEach(col => col.innerHTML = '');
        const events = [{ day: 1, type: 'event-match', title: 'Partido: Tricolor J. vs Equipo B', time: '3:00 PM - 5:00 PM', location: 'Cancha Principal' },{ day: 3, type: 'event-training', title: 'Entrenamiento: Tricolor P.', time: '6:00 PM - 8:00 PM', location: 'Cancha Principal' },{ day: 4, type: 'event-other', title: 'Mantenimiento', time: '8:00 AM - 12:00 PM', location: 'Cancha Auxiliar' },{ day: 5, type: 'event-training', title: 'Entrenamiento: Tricolor J.', time: '4:00 PM - 6:00 PM', location: 'Cancha Auxiliar' }];
        events.forEach(event => {
            const eventHtml = `<div class="calendar-event ${event.type}"><strong>${event.title}</strong><span>${event.time}</span><span>${event.location}</span></div>`;
            dayColumns[event.day].innerHTML += eventHtml;
        });
        document.querySelectorAll('.day-col .day-title').forEach((titleEl, index) => {
            const dayDate = new Date(weekStart);
            dayDate.setDate(dayDate.getDate() + index);
            const dayName = titleEl.textContent.split(' ')[0];
            titleEl.textContent = `${dayName} ${dayDate.getDate()}`;
        });
    }

    if (prevWeekBtn) prevWeekBtn.addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() - 7);
        updateCalendar();
    });

    if (nextWeekBtn) nextWeekBtn.addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() + 7);
        updateCalendar();
    });

    // --- FUNCIÓN HELPER para controlar el Modal (MODIFICADA CON VALIDACIÓN) ---
    function setupModal(buttonId, modalId, formId, successMessage) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        const openBtn = document.getElementById(buttonId);
        const closeBtn = modal.querySelector('.close-modal');
        const form = document.getElementById(formId);

        // --- OBTENER INPUTS DE FECHA Y HORA ---
        const fechaInicioInput = document.getElementById('fecha-inicio-reserva');
        const fechaFinInput = document.getElementById('fecha-fin-reserva');

        if (openBtn) openBtn.addEventListener('click', () => modal.style.display = 'flex');
        
        const closeModal = () => modal.style.display = 'none';
        
        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });

        // --- AÑADIR LISTENER PARA MEJORAR UX ---
        // Cuando se elige una fecha de inicio, la fecha de fin no puede ser anterior.
        if (fechaInicioInput) {
            fechaInicioInput.addEventListener('change', () => {
                if (fechaInicioInput.value) {
                    fechaFinInput.min = fechaInicioInput.value;
                }
            });
        }

        if (form) {
            form.addEventListener('submit', (event) => {
                event.preventDefault();

                // --- VALIDACIÓN DE FECHAS AL GUARDAR ---
                const fechaInicio = new Date(fechaInicioInput.value);
                const fechaFin = new Date(fechaFinInput.value);

                if (fechaFin < fechaInicio) {
                    showToast('Error: La fecha y hora de fin no puede ser anterior a la de inicio.', true);
                    return; // Detiene el proceso
                }

                // Si la validación es correcta:
                closeModal();
                showToast(successMessage);
                form.reset();
            });
        }
    }
    
    // --- FUNCIÓN HELPER para Notificaciones "Toast" ---
    function showToast(message, isError = false) {
        const toastContainer = document.getElementById('toast-container');
        if (!toastContainer) return;
        const toast = document.createElement('div');
        toast.className = `toast show ${isError ? 'error' : ''}`;
        toast.textContent = message;
        toastContainer.appendChild(toast);
        setTimeout(() => { toast.remove(); }, 3000);
    }

    // --- Instanciamos el modal y cargamos el calendario ---
    setupModal('btn-nueva-reserva', 'modal-nueva-reserva', 'form-nueva-reserva', 'Reserva creada con éxito.');
    if (weekRangeTitle) {
      updateCalendar(); // Carga inicial
    }
});