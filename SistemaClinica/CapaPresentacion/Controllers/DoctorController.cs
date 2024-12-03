using ClinicaData.Contrato;
using ClinicaEntidades;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ClinicaWeb.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DoctorController : ControllerBase
    {
        private readonly IDoctorRepositorio _repositorio;
        private readonly ICitaRepositorio _repositorioCita;
        public DoctorController(IDoctorRepositorio repositorio, ICitaRepositorio repositorioCita)
        {
            _repositorio = repositorio;
            _repositorioCita = repositorioCita;
        }

        [Authorize(Roles = "Administrador")]
        [HttpGet("index")]
        public IActionResult Index()
        {
            return Ok(new { message = "Bienvenido al API de Doctores" });
        }

        
        [HttpGet("lista")]
        public async Task<IActionResult> Lista()
        {
            List<Doctor> lista = await _repositorio.Lista();
            return Ok(new { data = lista });
        }

        [HttpPost("guardar")]
        public async Task<IActionResult> Guardar([FromBody] Doctor objeto)
        {
            string respuesta = await _repositorio.Guardar(objeto);
            return Ok(new { data = respuesta });
        }

        [HttpPut("editar")]
        public async Task<IActionResult> Editar([FromBody] Doctor objeto)
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

        [HttpGet("listaCitasAsignadas/{idEstadoCita}")]
        public async Task<IActionResult> ListaCitasAsignadas(int idEstadoCita)
        {
            ClaimsPrincipal claimuser = HttpContext.User;
            string idUsuario = claimuser.Claims.Where(c => c.Type == ClaimTypes.NameIdentifier).Select(c => c.Value).SingleOrDefault();

            List<Cita> lista = await _repositorio.ListaCitasAsignadas(int.Parse(idUsuario), idEstadoCita);
            return Ok(new { data = lista });
        }

        [HttpPost("cambiarEstado")]
        public async Task<IActionResult> CambiarEstado([FromBody] Cita objeto)
        {
            string respuesta = await _repositorioCita.CambiarEstado(objeto.IdCita, objeto.EstadoCita.IdEstadoCita, objeto.Indicaciones);
            return Ok(new { data = respuesta });
        }
    }
}
