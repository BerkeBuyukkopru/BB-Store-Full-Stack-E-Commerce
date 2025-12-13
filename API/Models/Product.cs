using System.ComponentModel.DataAnnotations;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace API.Models
{
    public class Price
    {
        [Required]
        public decimal Current { get; set; }
        public decimal? Discount { get; set; }
    }
    public class Product
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [Required(ErrorMessage = "Ürün Adı Zorunludur.")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Ürün Resmi Zorunludur.")]
        public List<string> Img { get; set; } = new List<string>();

        public List<Review> Reviews { get; set; } = new List<Review>();

        [Required(ErrorMessage ="Açıklama Zorunludur.")]
        public string Description { get; set; } = string.Empty;

        [Required(ErrorMessage ="Renk Bilgisi Zorunludur.")]
        public List<string> Colors { get; set; } = new List<string>();

        [Required(ErrorMessage ="Beden Bilgisi Zorunludur.")]
        public List<string> Sizes { get; set; } = new List<string>();

        [Required(ErrorMessage ="Fiyat Bilgisi Zorunludur.")] // Price nesnesinin kendisi zorunlu
        public Price ProductPrice { get; set; } = new Price();

        [Required(ErrorMessage ="Kategori Eklenmesi Zorunludur.")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Category { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    }
}