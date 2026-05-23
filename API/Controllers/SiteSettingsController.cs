using API.Models;
using API.Repositories;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SiteSettingsController : ControllerBase
    {
        private readonly SiteSettingRepository _repository;
        private readonly IHtmlSanitizationService _htmlSanitizer;

        public SiteSettingsController(SiteSettingRepository repository, IHtmlSanitizationService htmlSanitizer)
        {
            _repository = repository;
            _htmlSanitizer = htmlSanitizer;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var settings = await _repository.GetAsync();
            return Ok(settings);
        }

        [HttpPut]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Update([FromBody] SiteSetting updatedSetting)
        {
            updatedSetting.FooterPromotionDescription = _htmlSanitizer.Sanitize(updatedSetting.FooterPromotionDescription);
            updatedSetting.AboutUsPageContent = _htmlSanitizer.Sanitize(updatedSetting.AboutUsPageContent);
            updatedSetting.PrivacyPolicyPageContent = _htmlSanitizer.Sanitize(updatedSetting.PrivacyPolicyPageContent);

            await _repository.UpdateAsync(updatedSetting);
            return Ok(new { message = "Site ayarlari basariyla guncellendi." });
        }
    }
}
