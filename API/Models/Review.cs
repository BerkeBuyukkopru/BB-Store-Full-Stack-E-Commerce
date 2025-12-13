using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace API.Models
{
    public class Review
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string Text { get; set; } = string.Empty;

        public int Rating { get; set; }

        [BsonRepresentation(BsonType.ObjectId)]
        public string User { get; set; } = string.Empty;
    }
}