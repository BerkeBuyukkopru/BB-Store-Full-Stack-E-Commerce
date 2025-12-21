using API.Models;
using API.Repositories;
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
        public async Task<IActionResult> Create([FromBody] Slider slider)
        {
            await _repository.CreateAsync(slider);
            return CreatedAtAction(nameof(GetById), new { id = slider.Id }, slider);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] Slider slider)
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null) return NotFound();

            slider.Id = id;
            await _repository.UpdateAsync(id, slider);
            return Ok(new { message = "Slider güncellendi." });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null) return NotFound();

            await _repository.DeleteAsync(id);
            return Ok(new { message = "Slider silindi." });
        }
    }
}
