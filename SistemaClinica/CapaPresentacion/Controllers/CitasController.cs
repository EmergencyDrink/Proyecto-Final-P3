using ClinicaData.Contrato;
using ClinicaEntidades;
using ClinicaEntidades.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ClinicaWeb.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CitasController : ControllerBase
    {
        private readonly IDoctorRepositorio _repositorio;
        private readonly ICitaRepositorio _repositorioCita;

        public CitasController(IDoctorRepositorio repositorio, ICitaRepositorio repositorioCita)
        {
            _repositorio = repositorio;
            _repositorioCita = repositorioCita;
        }

        [Authorize(Roles = "Paciente")]
        [HttpGet("index")]
        public IActionResult Index()
        {
            return Ok(new { message = "Bienvenido al API de Citas para Pacientes" });
        }

        [Authorize(Roles = "Paciente")]
        [HttpGet("nuevaCita")]
        public IActionResult NuevaCita()
        {
            return Ok(new { message = "Formulario para crear una nueva cita" });
        }

        [Authorize(Roles = "Doctor")]
        [HttpGet("citasAsignadas")]
        public IActionResult CitasAsignadas()
        {
            return Ok(new { message = "Citas asignadas para Doctores" });
        }

        [HttpGet("listaDoctorHorarioDetalle/{id}")]
        public async Task<IActionResult> ListaDoctorHorarioDetalle(int id)
        {
            List<FechaAtencionDTO> lista = await _repositorio.ListaDoctorHorarioDetalle(id);
            return Ok(new { data = lista });
        }

        [HttpPost("guardar")]
        public async Task<IActionResult> Guardar([FromBody] Cita objeto)
        {
            ClaimsPrincipal claimuser = HttpContext.User;
            string idUsuario = claimuser.Claims.Where(c => c.Type == ClaimTypes.NameIdentifier).Select(c => c.Value).SingleOrDefault();

            objeto.Usuario = new Usuario
            {
                IdUsuario = int.Parse(idUsuario)
            };

            string respuesta = await _repositorioCita.Guardar(objeto);
            return Ok(new { data = respuesta });
        }

        [HttpGet("listaCitasPendiente")]
        public async Task<IActionResult> ListaCitasPendiente()
        {
            ClaimsPrincipal claimuser = HttpContext.User;
            string idUsuario = claimuser.Claims.Where(c => c.Type == ClaimTypes.NameIdentifier).Select(c => c.Value).SingleOrDefault();

            List<Cita> lista = await _repositorioCita.ListaCitasPendiente(int.Parse(idUsuario));
            return Ok(new { data = lista });
        }

        [HttpDelete("cancelar/{id}")]
        public async Task<IActionResult> Cancelar(int id)
        {
            string respuesta = await _repositorioCita.Cancelar(id);
            return Ok(new { data = respuesta });
        }
    }
}
