using ClinicaData.Contrato;
using ClinicaEntidades;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ClinicaWeb.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsuarioController : ControllerBase
    {
        private readonly IUsuarioRepositorio _repositorio;

        public UsuarioController(IUsuarioRepositorio repositorio)
        {
            _repositorio = repositorio;
        }

        [Authorize(Roles = "Administrador")]
        [HttpGet("index")]
        public IActionResult Index()
        {
            return Ok(new { message = "Bienvenido al API de Usuarios" });
        }

        [HttpGet("lista")]
        public async Task<IActionResult> Lista()
        {
            List<Usuario> lista = await _repositorio.Lista(1);
            return Ok(new { data = lista });
        }

        [HttpPost("guardar")]
        public async Task<IActionResult> Guardar([FromBody] Usuario objeto)
        {
            {
                if (objeto == null)
                {
                    return BadRequest("Usuario no proporcionado.");
                }

                string respuesta = await _repositorio.Guardar(objeto);
                return Ok(new { data = respuesta });
            }
        }

        [HttpPut("editar")]
        public async Task<IActionResult> Editar([FromBody] Usuario objeto)
        {
            if (objeto == null || objeto.IdUsuario <= 0)
            {
                return BadRequest("Datos del usuario no válidos.");
            }

            string respuesta = await _repositorio.Editar(objeto);
            return Ok(new { data = respuesta });
        }

        [HttpDelete("eliminar/{id}")]
        public async Task<IActionResult> Eliminar(int id)
        {
            int respuesta = await _repositorio.Eliminar(id);
            return Ok(new { data = respuesta });
        }
    }
}
