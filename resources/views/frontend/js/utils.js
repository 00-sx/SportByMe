// Archivo: js/utils.js
// Contiene funciones útiles que se pueden usar en cualquier página.

function mostrarMensaje(mensaje, tipo = 'info') {
    // Si ya existe un contenedor de mensajes, lo usamos. Si no, lo creamos.
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        // Estilos básicos para el contenedor de toasts
        toastContainer.style.position = 'fixed';
        toastContainer.style.top = '20px';
        toastContainer.style.right = '20px';
        toastContainer.style.zIndex = '2000';
        toastContainer.style.display = 'flex';
        toastContainer.style.flexDirection = 'column';
        toastContainer.style.gap = '10px';
        document.body.appendChild(toastContainer);
    }
    
    const toast = document.createElement('div');
    // Clases para que coincida con el CSS de main-styles.css
    toast.className = `toast show ${tipo === 'error' ? 'error' : ''}`;
    toast.textContent = mensaje;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 4000);
}