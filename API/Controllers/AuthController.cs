using Microsoft.AspNetCore.Mvc;
using API.Models;
using API.Repositories;
using API.Dtos;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserRepository _userRepository;

    // UserRepository'yi DI ile alıyoruz
    public AuthController(UserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    // Rota: POST /api/auth/register
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            // E-posta Benzersizlik Kontrolü
            var existingUser = await _userRepository.GetByEmailAsync(registerDto.Email);

            if (existingUser != null)
            {
                return BadRequest(new { error = "Email adresi daha önce kayıt edilmiş." });
            }

            // 2. Şifre Hashleme
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);

            // DTO'yu Model'e dönüştürme ve Hashlenmiş şifreyi atama
            var newUser = new User
            {
                Name = registerDto.Name,
                Surname = registerDto.Surname,
                Email = registerDto.Email,
                Password = hashedPassword,
                Role = UserRole.user
            };

            // Veritabanı kayıt
            await _userRepository.CreateAsync(newUser);

            // Şifreyi yanıttan kaldır.
            newUser.Password = null!;

            return CreatedAtAction(nameof(Register), new { id = newUser.Id }, newUser);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            return StatusCode(StatusCodes.Status500InternalServerError, new { error = "Server error." });
        }
    }

    // Rota: POST /api/auth/login
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
    {
        // DTO'daki [Required] kontrolleri
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            // E-posta ile kullanıcı bulma
            var user = await _userRepository.GetByEmailAsync(loginDto.Email);

            if (user == null)
            {
                return Unauthorized(new { error = "Invalid credentials." });
            }

            // Şifre doğrulama
            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(loginDto.Password, user.Password);

            if (!isPasswordValid)
            {
                return Unauthorized(new { error = "Invalid credentials." });
            }

            // Başarılı yanıt
            return Ok(new
            {
                id = user.Id,
                email = user.Email,
                name = user.Name,
                surname = user.Surname,
                role = user.Role.ToString().ToLower()
            });

        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            return StatusCode(StatusCodes.Status500InternalServerError, new { error = "Server error." });
        }
    }
}