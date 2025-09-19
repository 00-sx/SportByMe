document.addEventListener('DOMContentLoaded', function() {
        // DATOS ACTUALIZADOS CON LA HORA DEL EVENTO
        const mockEvents = [
            { date: '2025-05-01', time: '09:00 AM', title: 'Entrenamiento', type: 'entrenamiento' },
            { date: '2025-06-10', time: '03:00 PM', title: 'Partido Torneo', type: 'partido' }
        ];

        // ... (resto del script sin cambios)
        const monthYearTitle = document.getElementById('month-year-title');
        const calendarDaysGrid = document.getElementById('calendar-days-grid');
        const prevMonthBtn = document.getElementById('prev-month-btn');
        const nextMonthBtn = document.getElementById('next-month-btn');
        let currentDate = new Date();
        function renderCalendar() {
            let dateForMonth = new Date(currentDate);
            dateForMonth.setDate(1);
            const month = dateForMonth.getMonth();
            const year = dateForMonth.getFullYear();
            const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
            monthYearTitle.textContent = `${monthNames[month]} ${year}`;
            const lastDay = new Date(year, month + 1, 0).getDate();
            const firstDayIndex = (dateForMonth.getDay() + 6) % 7;
            const prevLastDay = new Date(year, month, 0).getDate();
            const lastDayDate = new Date(year, month, lastDay);
            const lastDayIndex = (lastDayDate.getDay() + 6) % 7;
            const nextDays = (6 - lastDayIndex);
            let daysHtml = '';
            for (let x = firstDayIndex; x > 0; x--) {
                daysHtml += `<div class="day not-in-month"><span class="day-number">${prevLastDay - x + 1}</span></div>`;
            }
            for (let i = 1; i <= lastDay; i++) {
                let dayEventsHtml = '';
                const currentDayString = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
                const eventsForDay = mockEvents.filter(e => e.date === currentDayString);
                if (eventsForDay.length > 0) {
                    eventsForDay.forEach(event => {
                        // HTML DEL EVENTO ACTUALIZADO PARA MOSTRAR LA HORA
                        dayEventsHtml += `<div class="event ${event.type}" title="${event.title}">
                                            <span class="event-time">${event.time}</span>
                                            <span class="event-title">${event.title}</span>
                                        </div>`;
                    });
                }
                daysHtml += `<div class="day"><span class="day-number">${i}</span>${dayEventsHtml}</div>`;
            }
            for (let j = 1; j <= nextDays; j++) {
                daysHtml += `<div class="day not-in-month"><span class="day-number">${j}</span></div>`;
            }
            calendarDaysGrid.innerHTML = daysHtml;
        }
        prevMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        });
        nextMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        });
        renderCalendar();
    });