// Archivo: js/entrenador/jugadores.js
document.addEventListener("DOMContentLoaded", () => {
    // Lógica para la página jugadores_categoria.html
    const selectCategoria = document.getElementById("categoriaJugadores");
    if (selectCategoria) {
        window.mostrarJugadoresCategoria = () => {
            const categoria = selectCategoria.value;
            const tablaContainer = document.getElementById("tablaJugadoresCategoria");
            if (categoria) {
                tablaContainer.innerHTML = `
                    <table class="data-table">
                        <thead><tr><th>Nombre</th><th>Edad</th><th>Posición</th></tr></thead>
                        <tbody>
                            <tr><td>Jugador 1 (${categoria})</td><td>15</td><td>Delantero</td></tr>
                            <tr><td>Jugador 2 (${categoria})</td><td>16</td><td>Defensa</td></tr>
                        </tbody>
                    </table>`;
            } else {
                tablaContainer.innerHTML = "";
            }
        };
    }

    // Lógica para la página jugadores_equipo.html
    const selectEquipo = document.getElementById("equipoJugadores");
    if(selectEquipo) {
        window.mostrarJugadoresEquipo = () => {
            const equipo = selectEquipo.value;
            const tablaContainer = document.getElementById("tablaJugadoresEquipo");
            if (equipo) {
                tablaContainer.innerHTML = `
                    <table class="data-table">
                        <thead><tr><th>Nombre</th><th>Edad</th><th>Posición</th></tr></thead>
                        <tbody>
                            <tr><td>Jugador 1 (${equipo})</td><td>17</td><td>Portero</td></tr>
                            <tr><td>Jugador 2 (${equipo})</td><td>18</td><td>Volante</td></tr>
                        </tbody>
                    </table>`;
            } else {
                tablaContainer.innerHTML = "";
            }
        };
    }
});