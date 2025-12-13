using System.ComponentModel.DataAnnotations;

namespace API.Dtos
{
    // Kayıt (Register) işlemi için gerekli veriyi taşır.
    public class RegisterDto
    {
        [Required(ErrorMessage = "İsim zorunludur.")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Soyisim zorunludur.")]
        public string Surname { get; set; } = string.Empty;

        [Required(ErrorMessage = "E-posta zorunludur.")]
        [EmailAddress(ErrorMessage = "Geçerli bir e-posta adresi girin.")]
        public string Email { get; set; } = string.Empty;

        // Düz metin şifreyi taşıyacak
        [Required(ErrorMessage = "Şifre zorunludur.")]
        [MinLength(6, ErrorMessage = "Şifre en az 6 karakter olmalıdır.")]
        [DataType(DataType.Password)]
        public string Password { get; set; } = string.Empty;
    }
}