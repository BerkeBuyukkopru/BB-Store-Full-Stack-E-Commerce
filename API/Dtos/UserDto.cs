using API.Models; // UserRole enum'ı için

namespace API.Dtos
{
    // Frontend'e gönderilecek güvenli kullanıcı bilgileri
    public class UserDto
    {
        public string? Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Surname { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public UserRole Role { get; set; } = UserRole.user;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}