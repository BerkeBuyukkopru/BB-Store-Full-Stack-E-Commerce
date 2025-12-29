using API.Models;
using API.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CargoCompanyController : ControllerBase
    {
        private readonly CargoCompanyRepository _cargoCompanyRepository;

        public CargoCompanyController(CargoCompanyRepository cargoCompanyRepository)
        {
            _cargoCompanyRepository = cargoCompanyRepository;
        }

        [HttpGet]
        public async Task<List<CargoCompany>> Get() =>
            await _cargoCompanyRepository.GetAllAsync();

        [HttpGet("{id}")]
        public async Task<ActionResult<CargoCompany>> Get(Guid id)
        {
            var cargoCompany = await _cargoCompanyRepository.GetByIdAsync(id);
            if (cargoCompany == null)
            {
                return NotFound();
            }
            return cargoCompany;
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Post(CargoCompany cargoCompany)
        {
            await _cargoCompanyRepository.CreateAsync(cargoCompany);
            return CreatedAtAction(nameof(Get), new { id = cargoCompany.Id }, cargoCompany);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Put(Guid id, CargoCompany cargoCompany)
        {
            var existingCargo = await _cargoCompanyRepository.GetByIdAsync(id);
            if (existingCargo == null)
            {
                return NotFound();
            }

            cargoCompany.Id = existingCargo.Id;
            await _cargoCompanyRepository.UpdateAsync(id, cargoCompany);
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var existingCargo = await _cargoCompanyRepository.GetByIdAsync(id);
            if (existingCargo == null)
            {
                return NotFound();
            }

            await _cargoCompanyRepository.DeleteAsync(id);
            return NoContent();
        }
    }
}
