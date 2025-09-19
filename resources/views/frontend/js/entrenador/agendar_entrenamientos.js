// Archivo: js/entrenador/agendar_entrenamientos.js
document.addEventListener("DOMContentLoaded", () => {
    const formContainer = document.getElementById('form-crear-sesion');
    const calendarContainer = document.getElementById('calendario');

    window.mostrarFormularioSesion = () => {
        calendarContainer.style.display = 'none';
        formContainer.style.display = 'block';
    };

    window.cancelarCrearSesion = () => {
        formContainer.style.display = 'none';
    };

    window.verCalendario = () => {
        formContainer.style.display = 'none';
        calendarContainer.style.display = 'block';

        const calendarioEventos = document.getElementById('calendarioEventos');
        if (calendarioEventos.innerHTML.trim() === "") { // Evita renderizar múltiples veces
            const calendar = new FullCalendar.Calendar(calendarioEventos, {
                initialView: 'dayGridMonth',
                locale: 'es',
                headerToolbar: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,listWeek'
                },
                events: [
                    { title: 'Entrenamiento Juvenil', start: '2025-06-25T16:00:00' },
                    { title: 'Preparación Mayores', start: '2025-06-28T10:00:00' }
                ]
            });
            calendar.render();
        }
    };

    const form = document.getElementById('crearSesionForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            mostrarMensaje('✅ Sesión creada correctamente (simulación)', 'success');
            cancelarCrearSesion();
            form.reset();
        });
    }
});