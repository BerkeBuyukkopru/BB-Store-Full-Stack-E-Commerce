using System.ComponentModel.DataAnnotations;

namespace API.Dtos
{
    public class UserUpdateDto
    {
        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public string Surname { get; set; } = string.Empty;

        // Email update might require re-verification, keeping it simple for now
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
    }
}
