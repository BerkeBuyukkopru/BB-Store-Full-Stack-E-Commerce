using System.ComponentModel.DataAnnotations;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace API.Dtos
{
    public class ReviewDto
    {
        [Required(ErrorMessage = "Yorum içeriği zorunludur.")]
        public string Text { get; set; } = string.Empty;

        [Required(ErrorMessage = "Puan alanı zorunludur.")]
        [Range(1, 5, ErrorMessage = "Puan 1 ile 5 arasında olmalıdır.")] 
        public int Rating { get; set; } 

        [Required(ErrorMessage = "Kullanıcı bilgisi zorunludur.")]
        public string User { get; set; } = string.Empty; 
    }
}