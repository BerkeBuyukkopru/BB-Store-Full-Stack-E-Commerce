// API/Dtos/CategoryDto.cs
using System.ComponentModel.DataAnnotations;
namespace API.Dtos
{
    public class CategoryDto
    {
        [Required(ErrorMessage = "Kategori adı zorunludur.")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Resim URL'si zorunludur.")]
        public string Img { get; set; } = string.Empty;
    }
}