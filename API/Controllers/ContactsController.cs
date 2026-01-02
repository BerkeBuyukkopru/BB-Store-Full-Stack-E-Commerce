using API.Models;
using API.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactsController : ControllerBase
    {
        private readonly ContactRepository _contactRepository;

        public ContactsController(ContactRepository contactRepository)
        {
            _contactRepository = contactRepository;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Contact contact)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (string.IsNullOrWhiteSpace(contact.Name) || string.IsNullOrWhiteSpace(contact.Email) || string.IsNullOrWhiteSpace(contact.Message))
            {
                return BadRequest("Ad, Email ve Mesaj alanları zorunludur.");
            }

            await _contactRepository.CreateAsync(contact);
            return Ok(new { message = "Mesajınız başarıyla iletildi." });
        }

        [HttpGet]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> GetAll()
        {
            var contacts = await _contactRepository.GetAllAsync();
            return Ok(contacts);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Update(string id, [FromBody] Contact contact)
        {
            var existingContact = await _contactRepository.GetByIdAsync(id);
            if (existingContact == null)
            {
                return NotFound("Mesaj bulunamadı.");
            }

            existingContact.IsRead = contact.IsRead;
            
            await _contactRepository.UpdateAsync(id, existingContact);
            return Ok(existingContact);
        }
    }
}
