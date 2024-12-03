$(document).ready(function() {
    function loadUsers() {
        $.getJSON('https://localhost:7201/api/Usuario/lista', function(response) {
            const users = response.data;
            $('#usersTableBody').empty();
            users.forEach(user => {
                $('#usersTableBody').append(`
                    <tr>
                        <td>${user.idUsuario}</td>
                        <td>${user.numeroDocumentoIdentidad}</td>
                        <td>${user.nombre}</td>
                        <td>${user.apellido}</td>
                        <td>${user.correo}</td>
                        <td>${user.rolUsuario.nombre}</td>
                        <td class="actions">
                            <button class="edit" data-id="${user.idUsuario}" data-documento="${user.numeroDocumentoIdentidad}" data-nombre="${user.nombre}" data-apellido="${user.apellido}" data-correo="${user.correo}" data-clave="${user.clave}" data-rol="${user.rolUsuario.idRolUsuario}">Editar</button>
                            <button class="delete" data-id="${user.idUsuario}">Eliminar</button>
                        </td>
                    </tr>
                `);
            });
            $('#usersTable').removeClass('hidden');
        });
    }

    function filterUsers() {
        const searchValue = $('#searchInput').val().toLowerCase();
        $('#usersTableBody tr').each(function() {
            const rowText = $(this).find('td').map(function() {
                return $(this).text().toLowerCase();
            }).get().join(' ');
            $(this).toggle(rowText.indexOf(searchValue) > -1);
        });
    }

    $('#loadUsersButton').click(loadUsers);

    $('#searchInput').on('input', filterUsers);

    $('#saveUserButton').click(function() {
        const id = $('#userId').val();
        const documento = $('#numeroDocumentoIdentidad').val();
        const nombre = $('#nombre').val();
        const apellido = $('#apellido').val();
        const correo = $('#correo').val();
        const clave = $('#clave').val();
        const rol = $('#rolUsuario').val();

        const user = {
            idUsuario: parseInt(id) || 0,
            numeroDocumentoIdentidad: documento,
            nombre: nombre,
            apellido: apellido,
            correo: correo,
            clave: clave,
            rolUsuario: {
                idRolUsuario: parseInt(rol) || 1, // Establecer rol por defecto si no se proporciona
                nombre: '' // Nombre del rol no se usa en la API para guardar
            },
            fechaCreacion: '' // Fecha de creación se puede dejar vacío
        };

        const url = id ? 'https://localhost:7201/api/Usuario/editar' : 'https://localhost:7201/api/Usuario/guardar';
        const method = id ? 'PUT' : 'POST';

        $.ajax({
            url: url,
            method: method,
            contentType: 'application/json',
            data: JSON.stringify(user),
            success: function() {
                alert(`Usuario ${id ? 'actualizado' : 'guardado'} exitosamente!`);
                loadUsers(); // Recargar la lista de usuarios
                $('#userForm').find('input').val(''); // Limpiar el formulario
                $('#formTitle').text('Agregar Nuevo Usuario');
                $('#userId').val(''); // Limpiar el ID oculto
                $('#usersTable').addClass('hidden'); // Ocultar tabla si no hay datos
            },
            error: function() {
                console.error(`Error al ${id ? 'actualizar' : 'guardar'} el usuario.`);
                alert(`Error al ${id ? 'actualizar' : 'guardar'} el usuario.`);
            }
        });
    });

    $(document).on('click', '.delete', function() {
        const id = $(this).data('id');
        if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
            $.ajax({
                url: `https://localhost:7201/api/Usuario/eliminar/${id}`,
                method: 'DELETE',
                success: function() {
                    alert('Usuario eliminado exitosamente!');
                    loadUsers(); // Recargar la lista de usuarios
                    $('#usersTable').addClass('hidden'); // Ocultar tabla si no hay datos
                },
                error: function() {
                    console.error('Error al eliminar el usuario.');
                    alert('Error al eliminar el usuario.');
                }
            });
        }
    });

    $(document).on('click', '.edit', function() {
        const id = $(this).data('id');
        const documento = $(this).data('documento');
        const nombre = $(this).data('nombre');
        const apellido = $(this).data('apellido');
        const correo = $(this).data('correo');
        const clave = $(this).data('clave');
        const rol = $(this).data('rol');

        $('#userId').val(id);
        $('#numeroDocumentoIdentidad').val(documento);
        $('#nombre').val(nombre);
        $('#apellido').val(apellido);
        $('#correo').val(correo);
        $('#clave').val(clave);
        $('#rolUsuario').val(rol);

        $('#formTitle').text('Editar Usuario');
    });

    $('#loadUsersButton').click(); // Cargar usuarios al cargar la página
});