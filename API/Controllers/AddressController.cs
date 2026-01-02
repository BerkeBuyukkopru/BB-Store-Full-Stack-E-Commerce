using API.Models;
using API.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AddressController : ControllerBase
    {
        private readonly UserRepository _userRepository;

        public AddressController(UserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAddresses()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null) return NotFound("Kullanıcı bulunamadı.");

            return Ok(user.Addresses ?? new List<Address>());
        }

        [HttpPost]
        public async Task<IActionResult> AddAddress([FromBody] Address address)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            if (string.IsNullOrWhiteSpace(address.Title) || string.IsNullOrWhiteSpace(address.City))
            {
                return BadRequest("Adres başlığı ve Şehir zorunludur.");
            }

            if (address.Id == Guid.Empty) address.Id = Guid.NewGuid();

            await _userRepository.AddAddressAsync(userId, address);

            return Ok(address);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAddress(Guid id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            await _userRepository.DeleteAddressAsync(userId, id);

            return Ok(new { message = "Adres silindi." });
        }

        [HttpPut]
        public async Task<IActionResult> UpdateAddress([FromBody] Address address)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            if (address.Id == Guid.Empty)
            {
                return BadRequest("Adres ID'si gereklidir.");
            }

            if (string.IsNullOrWhiteSpace(address.Title) || string.IsNullOrWhiteSpace(address.City))
            {
                return BadRequest("Adres başlığı ve Şehir zorunludur.");
            }

            await _userRepository.UpdateAddressAsync(userId, address);

            return Ok(address);
        }
    }
}
