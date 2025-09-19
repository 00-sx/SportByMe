document.addEventListener('DOMContentLoaded', function() {
    // --- OBTENCIÓN DE ELEMENTOS DEL DOM ---
    const formRegistroUsuario = document.getElementById('form-registro-usuario');
    const rolSelect = document.getElementById('rol_id');
    const tipoDocumentoSelect = document.getElementById('tipo_documento');
    const fechaNacimientoInput = document.getElementById('fecha_nacimiento');
    const camposEspecificosDiv = document.getElementById('campos-especificos-rol');

    // --- FUNCIÓN DE UTILIDAD PARA MOSTRAR MENSAJES ---
    function showToast(message, isError = false) {
        const toastContainer = document.getElementById('toast-container');
        if (!toastContainer) return;
        const toast = document.createElement('div');
        toast.className = `toast show ${isError ? 'error' : ''}`;
        toast.textContent = message;
        toastContainer.appendChild(toast);
        setTimeout(() => { toast.remove(); }, 5000);
    }

    // --- LÓGICA DE RESTRICCIÓN DE FECHA (VERSIÓN CON LÍMITE DE 100 AÑOS) ---
    function actualizarRestriccionesDeFecha() {
        const tipoDocumento = tipoDocumentoSelect.value;
        const hoy = new Date();
        
        // REGLA GLOBAL 1: La fecha máxima seleccionable es hoy.
        fechaNacimientoInput.max = hoy.toISOString().split('T')[0];
        
        // NUEVA REGLA GLOBAL 2: La fecha mínima es hace 100 años.
        const minDateGlobal = new Date(hoy.getFullYear() - 100, hoy.getMonth(), hoy.getDate());
        fechaNacimientoInput.min = minDateGlobal.toISOString().split('T')[0];

        switch (tipoDocumento) {
            case 'Cedula de Ciudadania':
                // Regla específica: Mayores de 18 años. Se sobreescribe el .max global si es más restrictivo.
                const maxDateAdulto = new Date(hoy.getFullYear() - 18, hoy.getMonth(), hoy.getDate());
                fechaNacimientoInput.max = maxDateAdulto.toISOString().split('T')[0];
                break;

            case 'Tarjeta de Identidad':
                // Regla específica: Entre 7 y 17 años. Se sobreescriben min y max.
                const maxDateTI = new Date(hoy.getFullYear() - 7, hoy.getMonth(), hoy.getDate());
                const minDateTI = new Date(hoy.getFullYear() - 18, hoy.getMonth(), hoy.getDate() + 1);
                fechaNacimientoInput.max = maxDateTI.toISOString().split('T')[0];
                fechaNacimientoInput.min = minDateTI.toISOString().split('T')[0];
                break;
            
            case 'Cedula de Extranjeria':
            case 'Pasaporte':
                // Regla específica: Mayores de 7 años. Se sobreescribe el .max global.
                const maxDateGeneral = new Date(hoy.getFullYear() - 7, hoy.getMonth(), hoy.getDate());
                fechaNacimientoInput.max = maxDateGeneral.toISOString().split('T')[0];
                break;
        }
    }

    // El resto de las funciones de validación y los listeners de eventos no necesitan cambios.
    // ... (El resto del archivo permanece igual que la versión anterior) ...
    // --- FUNCIÓN DE VALIDACIÓN FINAL (VERSIÓN DEFINITIVA) ---
    function validarEdadYDocumento() {
        const tipoDocumento = tipoDocumentoSelect.value;
        if (!fechaNacimientoInput.value || !tipoDocumento) {
            return { esValido: true };
        }

        const birthDate = new Date(fechaNacimientoInput.value);
        const hoy = new Date();
        if (birthDate > hoy) {
            return { esValido: false, mensaje: 'Error: La fecha de nacimiento no puede ser en el futuro.' };
        }
        
        let age = hoy.getFullYear() - birthDate.getFullYear();
        const m = hoy.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && hoy.getDate() < birthDate.getDate())) {
            age--;
        }
        
        if (age >= 100) {
             return { esValido: false, mensaje: 'Error: La edad no puede ser superior a 99 años.' };
        }

        switch (tipoDocumento) {
            case 'Cedula de Ciudadania':
                if (age < 18) {
                    return { esValido: false, mensaje: 'Error: La Cédula de Ciudadanía es para mayores de 18 años.' };
                }
                break;
            case 'Tarjeta de Identidad':
                 if (age < 7 || age >= 18) {
                    return { esValido: false, mensaje: 'Error: La Tarjeta de Identidad es para edades entre 7 y 17 años.' };
                }
                break;
            case 'Cedula de Extranjeria':
            case 'Pasaporte':
                if (age < 7) {
                    return { esValido: false, mensaje: `Error: Se debe tener al menos 7 años para registrarse con ${tipoDocumento}.` };
                }
                break;
        }
        return { esValido: true };
    }


    // --- MANEJO DE EVENTOS ---
    tipoDocumentoSelect.addEventListener('change', actualizarRestriccionesDeFecha);
    rolSelect.addEventListener('change', () => renderCamposEspecificos(rolSelect.value));

    formRegistroUsuario.addEventListener('submit', function(event) {
        event.preventDefault();

        // Validación de Contraseña
        const contrasena = document.getElementById('contrasena').value;
        const confirmarContrasena = document.getElementById('confirmar_contrasena').value;
        if (contrasena !== confirmarContrasena) {
            showToast('Las contraseñas no coinciden. Por favor, verifique.', true);
            return;
        }

        // Validación de Edad y Documento
        const validacionGeneral = validarEdadYDocumento();
        if (!validacionGeneral.esValido) {
            showToast(validacionGeneral.mensaje, true);
            return;
        }
        
        // Validación de Categoría de Deportista
        if (rolSelect.value === '5') {
            const equipoSelect = document.getElementById('equipo_id');
            const birthDateValue = fechaNacimientoInput.value;
            if (equipoSelect && birthDateValue) {
                const birthDate = new Date(birthDateValue);
                const today = new Date();
                let age = today.getFullYear() - birthDate.getFullYear();
                const m = today.getMonth() - birthDate.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) { age--; }

                const equipoId = equipoSelect.value;
                if (equipoId === '1' && age >= 18) {
                    showToast('Error: Los deportistas mayores de edad no pueden estar en la categoría Juvenil.', true);
                    return;
                }
                if ((equipoId === '2' || equipoId === '3') && age < 18) {
                    showToast('Error: Los menores de edad no pueden estar en categorías Profesional o Amateur.', true);
                    return;
                }
            }
        }

        // Si todas las validaciones pasan:
        showToast('Usuario registrado con éxito.');
        formRegistroUsuario.reset();
        camposEspecificosDiv.innerHTML = '';
        fechaNacimientoInput.removeAttribute('max');
        fechaNacimientoInput.removeAttribute('min');
    });
    
    // --- FUNCIÓN PARA RENDERIZAR CAMPOS DE ROL (VERSIÓN COMPLETA) ---
    function renderCamposEspecificos(rolId) {
        camposEspecificosDiv.innerHTML = ''; // Limpia el contenedor

        switch (rolId) {
            case '5': // ID del rol Deportista
                camposEspecificosDiv.innerHTML = `
                    <h4 class="module-title">Datos Específicos del Deportista</h4>
                    <div class="form-group">
                        <label for="equipo_id">Equipo:</label>
                        <select id="equipo_id" name="equipo_id" required>
                            <option value="">-- Seleccione un Equipo --</option>
                            <option value="1">Tricolor Juvenil</option>
                            <option value="2">Tricolor Profesional</option>
                            <option value="3">Tricolor Amateur</option>
                        </select>
                    </div>
                    <div class="form-group-row">
                         <div class="form-group">
                             <label for="posicion">Posición:</label>
                             <input type="text" id="posicion" name="posicion" placeholder="Ej: Delantero" required>
                         </div>
                         <div class="form-group">
                             <label for="numero_camiseta"># Camiseta:</label>
                             <input type="number" id="numero_camiseta" name="numero_camiseta" min="1" max="99">
                         </div>
                    </div>
                    <div class="form-group">
                        <label for="nombre_eps">Nombre EPS:</label>
                        <input type="text" id="nombre_eps" name="nombre_eps">
                    </div>`;
                break;
            case '6': // ID del rol Acudiente
                camposEspecificosDiv.innerHTML = `
                    <h4 class="module-title">Datos Específicos del Acudiente</h4>
                    <div class="form-group">
                        <label for="relacion">Relación con el Deportista:</label>
                        <input type="text" id="relacion" name="relacion" placeholder="Ej: Madre, Padre, Tutor" required>
                    </div>`;
                break;
            case '3': // Entrenador
                camposEspecificosDiv.innerHTML = `
                    <h4 class="module-title">Datos Específicos del Entrenador</h4>
                    <div class="form-group">
                        <label for="especialidad_entrenador">Especialidad:</label>
                        <input type="text" id="especialidad_entrenador" name="especialidad_entrenador" placeholder="Ej: Preparación física, Táctica">
                    </div>`;
                break;
            case '4': // Fisioterapeuta / Médico
                camposEspecificosDiv.innerHTML = `
                    <h4 class="module-title">Datos Específicos del Fisioterapeuta / Médico</h4>
                    <div class="form-group">
                        <label for="especialidad_fisioterapeuta">Especialidad:</label>
                        <input type="text" id="especialidad_fisioterapeuta" name="especialidad_fisioterapeuta" placeholder="Ej: Rehabilitación deportiva" required>
                    </div>`;
                break;
            case '1': // Administrador
                camposEspecificosDiv.innerHTML = `
                    <h4 class="module-title">Datos Específicos del Administrador</h4>
                    <div class="form-group">
                        <label for="nivel_acceso">Nivel de Acceso:</label>
                        <input type="text" id="nivel_acceso" name="nivel_acceso" placeholder="Ej: Superadmin, Gestor" required>
                    </div>`;
                break;
        }
    }
});