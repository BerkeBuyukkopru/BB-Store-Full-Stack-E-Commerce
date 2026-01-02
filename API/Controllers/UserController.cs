using Microsoft.AspNetCore.Mvc;
using API.Repositories;
using API.Dtos; // UserDto'nun kullanıldığı yer
using Microsoft.AspNetCore.Authorization; // [Authorize] için
using System.Linq;
using System.Threading.Tasks; // async/await için
using API.Models;

[ApiController]
[Route("api/[controller]")]
// Bu Controller'a sadece "admin" rolündekiler erişebilir.
[Authorize(Roles = "admin")]
public class UsersController : ControllerBase
{
    private readonly UserRepository _userRepository;

    public UsersController(UserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    // Rota: GET /api/users
    [HttpGet]
    public async Task<IActionResult> GetAllUsers()
    {
        try
        {
            var users = await _userRepository.GetAllAsync();

            var usersDto = users.Select(user => new UserDto
            {
                Id = user.Id,
                Name = user.Name,
                Surname = user.Surname,
                Email = user.Email,
                Role = user.Role,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt
            }).ToList();

            return Ok(usersDto);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Kullanıcıları getirirken hata oluştu: {ex.Message}");
            return StatusCode(500, new { error = "Internal server error. Kullanıcılar getirilemedi." });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(string id)
    {
        try
        {
            var userToDelete = await _userRepository.GetByIdAsync(id);

            if (userToDelete == null)
            {
                return NotFound(new { error = "Kullanıcı bulunamadı." });
            }

            if (userToDelete.Role == UserRole.admin)
            {
                var adminCount = await _userRepository.CountAdminsAsync();

                if (adminCount <= 1)
                {
                    return BadRequest(new
                    {
                        error = "Sistem Güvenliği Hatası",
                        message = "Sistemde Admin rolüne sahip tek kullanıcı silinemez. Lütfen önce başka bir Admin atayın."
                    });
                }
            }

            var deletedUser = await _userRepository.DeleteAsync(id);

            return Ok(new { message = $"Kullanıcı ({userToDelete.Name}) başarıyla silindi." });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Kullanıcı silinirken hata oluştu: {ex.Message}");
            return StatusCode(500, new { error = "Internal server error. Silme işlemi başarısız." });
        }
    }

}