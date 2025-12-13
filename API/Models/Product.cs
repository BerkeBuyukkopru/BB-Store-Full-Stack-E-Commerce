using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace API.Models
{
    public class Price
    {
        public decimal Current { get; set; }
        public decimal? Discount { get; set; }
    }
    public class Product
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public List<string> Img { get; set; } = new List<string>();

        public List<Review> Reviews { get; set; } = new List<Review>();

        public string Description { get; set; } = string.Empty;

        public List<string> Colors { get; set; } = new List<string>();

        public List<string> Sizes { get; set; } = new List<string>();

        public Price ProductPrice { get; set; } = new Price();

        [BsonRepresentation(BsonType.ObjectId)]
        public string Category { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    }
}