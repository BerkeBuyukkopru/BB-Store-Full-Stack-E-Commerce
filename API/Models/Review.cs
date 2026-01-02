using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace API.Models
{
    public class Review
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonRepresentation(BsonType.ObjectId)]
        public string UserId { get; set; } = string.Empty;

        [BsonRepresentation(BsonType.ObjectId)]
        public string TargetId { get; set; } = string.Empty;

        public string TargetType { get; set; } = "Product"; 

        public string Comment { get; set; } = string.Empty;

        public int Rating { get; set; } 

        public bool IsApproved { get; set; } = true; 

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}