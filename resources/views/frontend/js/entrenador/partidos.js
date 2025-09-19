// Archivo: js/entrenador/partidos.js
document.addEventListener("DOMContentLoaded", () => {
    // Lógica para la página principal de partidos
    const calendarioPartidos = document.getElementById('calendarioPartidos');
    if (calendarioPartidos) {
        window.verCalendarioPartidos = () => {
            calendarioPartidos.style.display = 'block';
            if (calendarioPartidos.innerHTML.trim() === "") {
                const calendar = new FullCalendar.Calendar(calendarioPartidos, {
                    initialView: 'dayGridMonth',
                    locale: 'es',
                    events: [
                        { title: 'Partido vs Rivales FC', start: '2025-07-05' },
                        { title: 'Partido Semifinal', start: '2025-07-12' }
                    ]
                });
                calendar.render();
            }
        };
    }

    // Lógica para el formulario de registrar resultado
    const formResultado = document.getElementById("formResultadoPartido");
    if(formResultado) {
        formResultado.addEventListener("submit", function(e) {
            e.preventDefault();
            mostrarMensaje("Resultado registrado correctamente (simulación)", "success");
            setTimeout(() => { window.location.href = "partidos.html"; }, 1500);
        });
    }
});