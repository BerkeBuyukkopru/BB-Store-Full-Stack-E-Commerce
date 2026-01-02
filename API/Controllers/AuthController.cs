using Microsoft.AspNetCore.Mvc;
using API.Models;
using API.Repositories;
using API.Dtos;
using API.Services;
using Microsoft.AspNetCore.Authorization;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserRepository _userRepository;
    private readonly ITokenService _tokenService;

    public AuthController(UserRepository userRepository, ITokenService tokenService)
    {
        _userRepository = userRepository;
        _tokenService = tokenService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var existingUser = await _userRepository.GetByEmailAsync(registerDto.Email);

            if (existingUser != null)
            {
                return BadRequest(new { error = "Email adresi daha önce kayıt edilmiş." });
            }

            // Şifre Hashleme
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);

            // DTO'yu Model'e dönüştürme ve Hashlenmiş şifreyi atama
            var newUser = new User
            {
                Name = registerDto.Name,
                Surname = registerDto.Surname,
                Email = registerDto.Email,
                Password = hashedPassword,
                Role = UserRole.user,
                CreatedAt = DateTime.UtcNow, // Zaman damgası ataması Controller'a alındı
                UpdatedAt = DateTime.UtcNow
            };

            // Veritabanı kayıt
            await _userRepository.CreateAsync(newUser);

            return CreatedAtAction(nameof(Register), new { id = newUser.Id }, newUser);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            return StatusCode(500, new { error = "Internal server error." });
        }
    }

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
            var user = await _userRepository.GetByEmailAsync(loginDto.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.Password))
            {
                return Unauthorized(new { error = "Invalid credentials." });
            }

            // JWT TOKEN OLUŞTURMA ---
            var token = _tokenService.CreateToken(user);

            // HTTP-ONLY COOKIE İLE TOKEN GÖNDERME ---
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true, // KRİTİK: JavaScript'in token'a erişimini engeller (XSS koruması)
                Secure = false,   // Sadece HTTPS üzerinde gönderilir
                SameSite = SameSiteMode.Strict, // CSRF riskini azaltır
                Expires = DateTime.UtcNow.AddHours(1) // Token ömrü
            };

            // Token'ı yanıtın Cookie başlığına ekle
            Response.Cookies.Append("AuthToken", token, cookieOptions);

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

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> GetCurrentUser()
    {
        try
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);

            if (userIdClaim == null)
            {
                return Unauthorized(new { error = "Token has no user identifier." });
            }

            var userId = userIdClaim.Value;
            var user = await _userRepository.GetByIdAsync(userId);

            if (user == null)
            {
                return Unauthorized(new { error = "Kullanıcı Bulunamadı." });
            }

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
            return StatusCode(500, new { error = "Internal server error." });
        }
    }

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        Response.Cookies.Delete("AuthToken", new CookieOptions
        {
            HttpOnly = true,
            Secure = false,
            SameSite = SameSiteMode.Strict,
            Expires = DateTimeOffset.UtcNow.AddDays(-1) // Geçmiş bir zaman
        });

        return Ok(new { message = "Successfully logged out." });
    }


    [HttpPut("update-profile")]
    [Authorize]
    public async Task<IActionResult> UpdateProfile([FromBody] UserUpdateDto updateDto)
    {
        try
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null) return NotFound("Kullanıcı bulunamadı.");

            // Update fields
            user.Name = updateDto.Name;
            user.Surname = updateDto.Surname;
            user.Email = updateDto.Email;
            user.UpdatedAt = DateTime.UtcNow;

            await _userRepository.UpdateAsync(userId, user);

            return Ok(new { message = "Profil başarıyla güncellendi.", user = new { user.Name, user.Surname, user.Email } });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            return StatusCode(500, new { error = "Internal server error." });
        }
    }

    [HttpPost("change-password")]
    [Authorize]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto passwordDto)
    {
        try
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null) return NotFound("Kullanıcı bulunamadı.");

            if (!BCrypt.Net.BCrypt.Verify(passwordDto.CurrentPassword, user.Password))
            {
                return BadRequest(new { error = "Mevcut şifre hatalı." });
            }

            string newHashedPassword = BCrypt.Net.BCrypt.HashPassword(passwordDto.NewPassword);
            user.Password = newHashedPassword;
            user.UpdatedAt = DateTime.UtcNow;

            await _userRepository.UpdateAsync(userId, user);

            return Ok(new { message = "Şifre başarıyla değiştirildi." });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            return StatusCode(500, new { error = "Internal server error." });
        }
    }
}
