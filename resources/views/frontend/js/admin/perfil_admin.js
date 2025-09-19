function openTab(evt, tabName) {
            var i, tabcontent, tablinks;
            tabcontent = document.getElementsByClassName("tab-content");
            for (i = 0; i < tabcontent.length; i++) {
                tabcontent[i].style.display = "none";
                tabcontent[i].classList.remove("active");
            }
            tablinks = document.getElementsByClassName("tab-link");
            for (i = 0; i < tablinks.length; i++) {
                tablinks[i].className = tablinks[i].className.replace(" active", "");
            }
            document.getElementById(tabName).style.display = "block";
            document.getElementById(tabName).classList.add("active");
            evt.currentTarget.className += " active";
        }

        function showToast(message, isError = false) {
            const container = document.getElementById('toast-container');
            const toast = document.createElement('div');
            toast.className = `toast show ${isError ? 'error' : ''}`;
            toast.textContent = message;
            container.appendChild(toast);
            setTimeout(() => { toast.remove(); }, 3000);
        }

        document.addEventListener('DOMContentLoaded', function() {
            document.getElementById('form-datos-personales').addEventListener('submit', function(e) {
                e.preventDefault();
                showToast('¡Datos personales actualizados con éxito!');
            });

            document.getElementById('form-cambiar-contrasena').addEventListener('submit', function(e) {
                e.preventDefault();
                const newPassword = document.getElementById('new_password').value;
                const confirmPassword = document.getElementById('confirm_password').value;

                if (newPassword !== confirmPassword) {
                    showToast('La nueva contraseña y su confirmación no coinciden.', true);
                    return;
                }
                
                if (newPassword.length < 8) {
                    showToast('La nueva contraseña debe tener al menos 8 caracteres.', true);
                    return;
                }
                
                showToast('¡Contraseña cambiada con éxito!');
                this.reset();
            });

            document.querySelector('.tab-link.active').click();
        });