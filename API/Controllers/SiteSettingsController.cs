using API.Models;
using API.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SiteSettingsController : ControllerBase
    {
        private readonly SiteSettingRepository _repository;

        public SiteSettingsController(SiteSettingRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var settings = await _repository.GetAsync();
            return Ok(settings);
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] SiteSetting updatedSetting)
        {
            await _repository.UpdateAsync(updatedSetting);
            return Ok(new { message = "Site ayarları başarıyla güncellendi." });
        }
    }
}
