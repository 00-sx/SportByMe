document.addEventListener('DOMContentLoaded', function() {
        // DATOS SIMULADOS ACTUALIZADOS CON LA EDAD
        const mockDeportistas = [
            { id: 1, nombre: 'Carlos Martinez', edad: 11, email: 'carlos.martinez@example.com', equipo: 'Tricolor Juvenil', categoria: 'Juvenil' },
            { id: 2, nombre: 'Carlos Ramírez', edad: 13, email: 'carlos.z@example.com', equipo: 'Tricolor Juvenil', categoria: 'Juvenil' },
            { id: 3, nombre: 'Sofia Gómez', edad: 24, email: 'sofia.gomez@example.com', equipo: 'Tricolor Profesional', categoria: 'Profesional' }
        ];

        const tableBody = document.getElementById('deportistas-table-body');
        const filterContainer = document.getElementById('category-filters');
        const filterButtons = filterContainer.querySelectorAll('.tab-link');

        function renderTable(categoriaFiltro) {
            tableBody.innerHTML = ''; 

            const deportistasAMostrar = categoriaFiltro === 'Todos'
                ? mockDeportistas
                : mockDeportistas.filter(d => d.categoria === categoriaFiltro);
            
            if (deportistasAMostrar.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center;">No hay deportistas en esta categoría.</td></tr>`;
                return;
            }

            deportistasAMostrar.forEach(d => {
                // SE AÑADE LA CELDA PARA LA EDAD
                const row = `<tr>
                                <td><a href="perfil_deportista.html?id=${d.id}">${d.nombre}</a></td>
                                <td>${d.edad}</td>
                                <td>${d.email}</td>
                                <td>${d.equipo}</td>
                                <td>${d.categoria}</td>
                                <td>
                                    <a href="perfil_deportista.html?id=${d.id}">Ver Perfil</a> | 
                                    <a href="#" class="text-danger">Eliminar</a>
                                </td>
                            </tr>`;
                tableBody.innerHTML += row;
            });
        }

        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                const categoria = this.getAttribute('data-category');
                renderTable(categoria);
            });
        });

        renderTable('Todos');
    });