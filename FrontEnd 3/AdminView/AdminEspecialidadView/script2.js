$(document).ready(function() {
    function loadSpecialities() {
        $.getJSON('https://localhost:7201/api/Especialidad/lista', function(response) {
            const specialities = response.data;
            $('#specialitiesTableBody').empty();
            specialities.forEach(speciality => {
                $('#specialitiesTableBody').append(`
                    <tr>
                        <td>${speciality.idEspecialidad}</td>
                        <td>${speciality.nombre}</td>
                        <td class="actions">
                            <button class="edit" data-id="${speciality.idEspecialidad}" data-nombre="${speciality.nombre}">Editar</button>
                            <button class="delete" data-id="${speciality.idEspecialidad}">Eliminar</button>
                        </td>
                    </tr>
                `);
            });
            $('#specialitiesTable').removeClass('hidden');
        });
    }

    function filterSpecialities() {
        const searchValue = $('#searchInput').val().toLowerCase();
        $('#specialitiesTableBody tr').each(function() {
            const rowText = $(this).find('td').map(function() {
                return $(this).text().toLowerCase();
            }).get().join(' ');
            $(this).toggle(rowText.indexOf(searchValue) > -1);
        });
    }

    $('#loadSpecialitiesButton').click(loadSpecialities);

    $('#searchInput').on('input', filterSpecialities);

    $('#saveSpecialityButton').click(function() {
        const id = $('#specialityId').val();
        const nombre = $('#nombre').val();

        const speciality = {
            idEspecialidad: parseInt(id) || 0,
            nombre: nombre,
            fechaCreacion: '' // Fecha de creación se puede dejar vacío
        };

        const url = id ? 'https://localhost:7201/api/Especialidad/editar' : 'https://localhost:7201/api/Especialidad/guardar';
        const method = id ? 'PUT' : 'POST';

        $.ajax({
            url: url,
            method: method,
            contentType: 'application/json',
            data: JSON.stringify(speciality),
            success: function() {
                alert(`Especialidad ${id ? 'actualizada' : 'guardada'} exitosamente!`);
                loadSpecialities(); // Recargar la lista de especialidades
                $('#specialityForm').find('input').val(''); // Limpiar el formulario
                $('#formTitle').text('Agregar Nueva Especialidad');
                $('#specialityId').val(''); // Limpiar el ID oculto
                $('#specialitiesTable').addClass('hidden'); // Ocultar tabla si no hay datos
            },
            error: function() {
                console.error(`Error al ${id ? 'actualizar' : 'guardar'} la especialidad.`);
                alert(`Error al ${id ? 'actualizar' : 'guardar'} la especialidad.`);
            }
        });
    });

    $(document).on('click', '.delete', function() {
        const id = $(this).data('id');
        if (confirm('¿Estás seguro de que quieres eliminar esta especialidad?')) {
            $.ajax({
                url: `https://localhost:7201/api/Especialidad/eliminar/${id}`,
                method: 'DELETE',
                success: function() {
                    alert('Especialidad eliminada exitosamente!');
                    loadSpecialities(); // Recargar la lista de especialidades
                    $('#specialitiesTable').addClass('hidden'); // Ocultar tabla si no hay datos
                },
                error: function() {
                    console.error('Error al eliminar la especialidad.');
                    alert('Error al eliminar la especialidad.');
                }
            });
        }
    });

    $(document).on('click', '.edit', function() {
        const id = $(this).data('id');
        const nombre = $(this).data('nombre');

        $('#specialityId').val(id);
        $('#nombre').val(nombre);

        $('#formTitle').text('Editar Especialidad');
    });

    $('#loadSpecialitiesButton').click(); // Cargar especialidades al cargar la página
});