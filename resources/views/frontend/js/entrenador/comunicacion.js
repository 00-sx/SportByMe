// Archivo: js/entrenador/comunicacion.js
document.addEventListener("DOMContentLoaded", () => {
    // Lógica para el formulario de notificar_acudientes.html
    const formNotificacion = document.getElementById("formNotificacion");
    if(formNotificacion) {
        formNotificacion.addEventListener("submit", function(e) {
            e.preventDefault();
            mostrarMensaje("Notificación enviada correctamente (simulación)", "success");
            setTimeout(() => { window.location.href = "comunicacion.html"; }, 1500);
        });
    }

    // Lógica para el formulario de recibir_sugerencias.html
    const formSugerencias = document.getElementById("formSugerencias");
    if(formSugerencias) {
        formSugerencias.addEventListener("submit", function(e) {
            e.preventDefault();
            mostrarMensaje("Sugerencia recibida correctamente (simulación)", "success");
            setTimeout(() => { window.location.href = "comunicacion.html"; }, 1500);
        });
    }
});