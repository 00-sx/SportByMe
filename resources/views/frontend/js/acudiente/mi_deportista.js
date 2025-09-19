// --- Lógica para Pestañas ---
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
        
        // --- Lógica para el Acordeón ---
        document.querySelectorAll('.accordion-header').forEach(header => {
            header.addEventListener('click', () => {
                const item = header.parentElement;
                item.classList.toggle('active');
            });
        });