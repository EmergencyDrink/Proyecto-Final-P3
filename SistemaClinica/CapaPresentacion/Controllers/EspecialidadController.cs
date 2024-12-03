using ClinicaData.Contrato;
using ClinicaEntidades;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ClinicaWeb.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EspecialidadController : ControllerBase
    {
        private readonly IEspecialidadRepositorio _repositorio;

        public EspecialidadController(IEspecialidadRepositorio repositorio)
        {
            _repositorio = repositorio;
        }

        
        [HttpGet("index")]
        public IActionResult Index()
        {
            return Ok(new { message = "Bienvenido al API de Especialidades" });
        }

        [HttpGet("lista")]
        public async Task<IActionResult> Lista()
        {
            List<Especialidad> lista = await _repositorio.Lista();
            return Ok(new { data = lista });
        }

        [HttpPost("guardar")]
        public async Task<IActionResult> Guardar([FromBody] Especialidad objeto)
        {
            string respuesta = await _repositorio.Guardar(objeto);
            return Ok(new { data = respuesta });
        }

        [HttpPut("editar")]
        public async Task<IActionResult> Editar([FromBody] Especialidad objeto)
        {
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
