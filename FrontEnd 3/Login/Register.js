document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const documentoIdentidad = document.getElementById('loginDocumentoIdentidad').value;
        const clave = document.getElementById('loginClave').value;
        
        const messageContainer = document.getElementById('loginMessageContainer');
        
        try {
            const data = await login(documentoIdentidad, clave);
            messageContainer.innerHTML = '<p>Login exitoso.</p>';
            redirigirSegunRol(data.role);
        } catch (error) {
            messageContainer.innerHTML = `<p>${error.message}</p>`;
        }
    });

    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const documentoIdentidad = document.getElementById('registerDocumentoIdentidad').value;
        const nombre = document.getElementById('registerNombre').value;
        const apellido = document.getElementById('registerApellido').value;
        const correo = document.getElementById('registerCorreo').value;
        const clave = document.getElementById('registerClave').value;
        const confirmarClave = document.getElementById('registerConfirmarClave').value;
        
        const messageContainer = document.getElementById('registerMessageContainer');
        
        try {
            await registrarse(documentoIdentidad, nombre, apellido, correo, clave, confirmarClave);
            messageContainer.innerHTML = '<p>Cuenta creada con éxito.</p>';
        } catch (error) {
            messageContainer.innerHTML = `<p>${error.message}</p>`;
        }
    });
});

async function login(documentoIdentidad, clave) {
    const response = await fetch('https://localhost:7201/api/Acceso/Login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            DocumentoIdentidad: documentoIdentidad,
            Clave: clave
        })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.errorMessage || 'Error en el login');
    }

    return data;
}

async function registrarse(documentoIdentidad, nombre, apellido, correo, clave, confirmarClave) {
    const response = await fetch('https://localhost:7201/api/Acceso/Registrarse', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            DocumentoIdentidad: documentoIdentidad,
            Nombre: nombre,
            Apellido: apellido,
            Correo: correo,
            Clave: clave,
            ConfirmarClave: confirmarClave
        })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.errorMessage || 'Error al crear la cuenta');
    }

    return data;
}

function redirigirSegunRol(rol) {
    switch (rol) {
        case 'Administrador':
            window.location.href = '/AdminView/admin.html';
            break;
        case 'Paciente':
            window.location.href = '/UserView/home.html';
            break;
        case 'Doctor':
            window.location.href = '/DoctorView/doctor.html';
            break;
        default:
            window.location.href = '';
            break;
    }
}
