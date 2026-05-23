using API.Models;
using API.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SlidersController : ControllerBase
    {
        private readonly SliderRepository _repository;

        public SlidersController(SliderRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var sliders = await _repository.GetAllAsync();
            return Ok(sliders);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var slider = await _repository.GetByIdAsync(id);
            if (slider == null) return NotFound();
            return Ok(slider);
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Create([FromBody] Slider slider)
        {
            var existingOrder = await _repository.GetByOrderAsync(slider.Order);
            if (existingOrder != null)
            {
                return BadRequest("Bu sıra numarası zaten kullanımda.");
            }

            await _repository.CreateAsync(slider);
            return CreatedAtAction(nameof(GetById), new { id = slider.Id }, slider);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Update(string id, [FromBody] Slider slider)
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null) return NotFound();

            if (slider.Order != existing.Order) 
            {
                var conflict = await _repository.GetByOrderAsync(slider.Order);
                if (conflict != null)
                {
                    return BadRequest("Bu sıra numarası zaten kullanımda.");
                }
            }

            slider.Id = id;
            await _repository.UpdateAsync(id, slider);
            return Ok(new { message = "Slider güncellendi." });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Delete(string id)
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null) return NotFound();

            await _repository.DeleteAsync(id);
            return Ok(new { message = "Slider silindi." });
        }
    }
}
