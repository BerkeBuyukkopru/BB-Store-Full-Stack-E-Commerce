using System.ComponentModel.DataAnnotations;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;


namespace API.Models
{
    public class Review
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [Required(ErrorMessage ="Yorum Zorunludur")]
        public string Text { get; set; } = string.Empty;

        [Required(ErrorMessage ="Puan Zorunludur")]
        public int Rating { get; set; } 

        [Required]
        [BsonRepresentation(BsonType.ObjectId)] 
        public string User { get; set; } = string.Empty; 
    }
}