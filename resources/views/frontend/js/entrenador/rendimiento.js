// Archivo: js/entrenador/rendimiento.js
document.addEventListener("DOMContentLoaded", () => {
    // Lógica para el formulario de evaluar_jugador.html
    const formEvaluacion = document.getElementById("formEvaluacion");
    if(formEvaluacion) {
        formEvaluacion.addEventListener("submit", function(e) {
            e.preventDefault();
            mostrarMensaje("Evaluación registrada correctamente (simulación)", "success");
            setTimeout(() => { window.location.href = "rendimiento.html"; }, 1500);
        });
    }

    // Lógica para el gráfico de ver_estadisticas.html
    const ctx = document.getElementById('graficoRendimiento');
    if (ctx) {
        new Chart(ctx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Resistencia', 'Técnica', 'Táctica', 'Velocidad', 'Disciplina'],
                datasets: [{
                    label: 'Promedio Equipo',
                    data: [8, 7, 6, 7, 9],
                    backgroundColor: '#00bcd4',
                    borderColor: '#007a8a',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true, max: 10 }
                }
            }
        });
    }
});