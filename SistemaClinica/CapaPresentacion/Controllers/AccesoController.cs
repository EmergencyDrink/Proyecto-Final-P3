using ClinicaEntidades;
using CapaPresentacion.Models.DTOs;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using ClinicaData.Contrato;

namespace ClinicaWeb.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccesoController : ControllerBase
    {
        private readonly IUsuarioRepositorio _repositorio;

        public AccesoController(IUsuarioRepositorio repositorio)
        {
            _repositorio = repositorio;
        }

        [HttpPost("Login")]
        public async Task<ActionResult> Login([FromBody] VMUsuarioLogin modelo)
        {
            if (modelo.DocumentoIdentidad == null || modelo.Clave == null)
            {
                return BadRequest(new { errorMessage = "No se encontraron coincidencias" });
            }

            Usuario usuario_encontrado = await _repositorio.Login(modelo.DocumentoIdentidad, modelo.Clave);

            if (usuario_encontrado == null)
            {
                return BadRequest(new { errorMessage = "No se encontraron coincidencias" });
            }

            // Aquí guarda la información del usuario
            List<Claim> claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, $"{usuario_encontrado.Nombre} {usuario_encontrado.Apellido}"),
            new Claim(ClaimTypes.NameIdentifier, usuario_encontrado.IdUsuario.ToString()),
            new Claim(ClaimTypes.Role, usuario_encontrado.RolUsuario.Nombre)
        };

            ClaimsIdentity claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            AuthenticationProperties properties = new AuthenticationProperties
            {
                AllowRefresh = true
            };

            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimsIdentity), properties);

            return Ok(new { message = "Login exitoso", role = usuario_encontrado.RolUsuario.Nombre });
        }

        [HttpPost("Registrarse")]
        public async Task<ActionResult> Registrarse([FromBody] VMPaciente modelo)
        {
            if (modelo.Clave != modelo.ConfirmarClave)
            {
                return BadRequest(new { errorMessage = "Las contraseñas no coinciden" });
            }

            Usuario objeto = new Usuario
            {
                NumeroDocumentoIdentidad = modelo.DocumentoIdentidad,
                Nombre = modelo.Nombre,
                Apellido = modelo.Apellido,
                Correo = modelo.Correo,
                Clave = modelo.Clave,
                RolUsuario = new RolUsuario
                {
                    IdRolUsuario = 2
                }
            };

            string resultado = await _repositorio.Guardar(objeto);
            if (string.IsNullOrEmpty(resultado))
            {
                return Ok(new { message = "Su cuenta ha sido creada." });
            }
            return BadRequest(new { errorMessage = resultado });
        }
    }
}
