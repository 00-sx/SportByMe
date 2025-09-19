// Archivo: js/entrenador/historial_medico.js
document.addEventListener("DOMContentLoaded", () => {
    const selectJugador = document.getElementById("jugadorSeleccionado");
    if(selectJugador) {
        window.mostrarHistorialJugador = () => {
            const jugador = selectJugador.value;
            const tablaContainer = document.getElementById("tablaHistorialJugador");
            if (jugador) {
                tablaContainer.innerHTML = `
                <table class="data-table">
                    <thead><tr><th>Lesión</th><th>Fecha</th><th>Estado</th></tr></thead>
                    <tbody>
                    <tr><td>Lesión simulada (${jugador})</td><td>2025-06-10</td><td>Recuperado</td></tr>
                    </tbody>
                </table>`;
            } else {
                tablaContainer.innerHTML = "";
            }
        };
    }
});