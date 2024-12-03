using CapaPresentacion.Models.DTOs;
using CapaPresentacion.Models;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using Microsoft.AspNetCore.Authorization;

namespace ClinicaWeb.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HomeController : ControllerBase
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        [Authorize(Roles = "Administrador")]
        [HttpGet("index")]
        public IActionResult Index()
        {
            return Ok(new { message = "Bienvenido al API de Administrador" });
        }

        [Authorize(Roles = "Administrador")]
        [HttpGet("privacy")]
        public IActionResult Privacy()
        {
            return Ok(new { message = "Política de privacidad del API de Administrador" });
        }

        [HttpGet("error")]
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            var errorModel = new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier };
            return BadRequest(new { message = "Ocurrió un error", error = errorModel });
        }

        [HttpPost("salir")]
        public async Task<IActionResult> Salir()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return Ok(new { message = "Sesión cerrada" });
        }
    }

    public class ErrorViewModel
    {
        public string RequestId { get; set; }
    }
}
