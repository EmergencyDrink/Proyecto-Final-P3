using ClinicaData.Contrato;
using ClinicaEntidades;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ClinicaWeb.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DoctorHorarioController : ControllerBase
    {
        private readonly IDoctorRepositorio _repositorio;

        public DoctorHorarioController(IDoctorRepositorio repositorio)
        {
            _repositorio = repositorio;
        }

        [HttpGet("Lista")]
        public async Task<ActionResult<IEnumerable<DoctorHorario>>> Lista()
        {
            List<DoctorHorario> lista = await _repositorio.ListaDoctorHorario();
            return Ok(new { data = lista });
        }

        [HttpPost("Guardar")]
        public async Task<ActionResult> Guardar([FromBody] DoctorHorario objeto)
        {
            if (objeto == null)
            {
                return BadRequest(new { errorMessage = "El objeto no puede ser nulo." });
            }

            string respuesta = await _repositorio.RegistrarHorario(objeto);
            return Ok(new { data = respuesta });
        }

        [HttpDelete("Eliminar/{id}")]
        public async Task<ActionResult> Eliminar(int id)
        {
            if (id <= 0)
            {
                return BadRequest(new { errorMessage = "ID inválido." });
            }

            string respuesta = await _repositorio.EliminarHorario(id);
            return Ok(new { data = respuesta });
        }
    }
}
