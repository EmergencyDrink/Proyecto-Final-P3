$(document).ready(function() {
    function loadSpecialities() {
        $.getJSON('https://localhost:7201/api/Especialidad/lista', function(response) {
            const specialities = response.data;
            const $especialidadSelect = $('#especialidad');
            $especialidadSelect.empty();
            specialities.forEach(speciality => {
                $especialidadSelect.append(`<option value="${speciality.idEspecialidad}">${speciality.nombre}</option>`);
            });
        });
    }

    function loadDoctors() {
        $.getJSON('https://localhost:7201/api/Doctor/lista', function(response) {
            const doctors = response.data;
            $('#doctorsTableBody').empty();
            doctors.forEach(doctor => {
                $('#doctorsTableBody').append(`
                    <tr>
                        <td>${doctor.idDoctor}</td>
                        <td>${doctor.numeroDocumentoIdentidad}</td>
                        <td>${doctor.nombres}</td>
                        <td>${doctor.apellidos}</td>
                        <td>${doctor.genero}</td>
                        <td>${doctor.especialidad.nombre}</td>
                        <td class="actions">
                            <button class="edit" data-id="${doctor.idDoctor}" data-documento="${doctor.numeroDocumentoIdentidad}" data-nombres="${doctor.nombres}" data-apellidos="${doctor.apellidos}" data-genero="${doctor.genero}" data-especialidad="${doctor.especialidad.idEspecialidad}">Editar</button>
                            <button class="delete" data-id="${doctor.idDoctor}">Eliminar</button>
                        </td>
                    </tr>
                `);
            });
            $('#doctorsTable').removeClass('hidden');
        });
    }

    function filterDoctors() {
        const searchValue = $('#searchInput').val().toLowerCase();
        $('#doctorsTableBody tr').each(function() {
            const rowText = $(this).find('td').map(function() {
                return $(this).text().toLowerCase();
            }).get().join(' ');
            $(this).toggle(rowText.indexOf(searchValue) > -1);
        });
    }

    $('#loadDoctorsButton').click(loadDoctors);

    $('#searchInput').on('input', filterDoctors);

    $('#saveDoctorButton').click(function() {
        const id = $('#doctorId').val();
        const numeroDocumentoIdentidad = $('#numeroDocumentoIdentidad').val();
        const nombres = $('#nombres').val();
        const apellidos = $('#apellidos').val();
        const genero = $('#genero').val();
        const idEspecialidad = $('#especialidad').val();

        const doctor = {
            idDoctor: parseInt(id) || 0,
            numeroDocumentoIdentidad: numeroDocumentoIdentidad,
            nombres: nombres,
            apellidos: apellidos,
            genero: genero,
            especialidad: {
                idEspecialidad: parseInt(idEspecialidad),
                nombre: '', // Nombre se puede dejar vacío, no se usa en el servidor
                fechaCreacion: '' // Fecha de creación se puede dejar vacío
            },
            fechaCreacion: '' // Fecha de creación se puede dejar vacío
        };

        const url = id ? 'https://localhost:7201/api/Doctor/editar' : 'https://localhost:7201/api/Doctor/guardar';
        const method = id ? 'PUT' : 'POST';

        $.ajax({
            url: url,
            method: method,
            contentType: 'application/json',
            data: JSON.stringify(doctor),
            success: function() {
                alert(`Doctor ${id ? 'actualizado' : 'guardado'} exitosamente!`);
                loadDoctors(); // Recargar la lista de doctores
                $('#doctorForm').find('input, select').val(''); // Limpiar el formulario
                $('#doctorForm').find('select').val('M'); // Resetear el select a 'M'
                $('#formTitle').text('Agregar Nuevo Doctor');
                $('#doctorId').val(''); // Limpiar el ID oculto
                $('#doctorsTable').addClass('hidden'); // Ocultar tabla si no hay datos
            },
            error: function() {
                console.error(`Error al ${id ? 'actualizar' : 'guardar'} el doctor.`);
                alert(`Error al ${id ? 'actualizar' : 'guardar'} el doctor.`);
            }
        });
    });

    $(document).on('click', '.delete', function() {
        const id = $(this).data('id');
        if (confirm('¿Estás seguro de que quieres eliminar este doctor?')) {
            $.ajax({
                url: `https://localhost:7201/api/Doctor/eliminar/${id}`,
                method: 'DELETE',
                success: function() {
                    alert('Doctor eliminado exitosamente!');
                    loadDoctors(); // Recargar la lista de doctores
                    $('#doctorsTable').addClass('hidden'); // Ocultar tabla si no hay datos
                },
                error: function() {
                    console.error('Error al eliminar el doctor.');
                    alert('Error al eliminar el doctor.');
                }
            });
        }
    });

    $(document).on('click', '.edit', function() {
        const id = $(this).data('id');
        const documento = $(this).data('documento');
        const nombres = $(this).data('nombres');
        const apellidos = $(this).data('apellidos');
        const genero = $(this).data('genero');
        const especialidad = $(this).data('especialidad');

        $('#doctorId').val(id);
        $('#numeroDocumentoIdentidad').val(documento);
        $('#nombres').val(nombres);
        $('#apellidos').val(apellidos);
        $('#genero').val(genero);
        $('#especialidad').val(especialidad);

        $('#formTitle').text('Editar Doctor');
    });

    loadSpecialities(); // Cargar especialidades al cargar la página
});