using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace API.Models
{
    public class Price
    {
        public decimal Current { get; set; }
        public decimal? Discount { get; set; }
    }
    public class ProductSize 
    {
        public string Size { get; set; } = string.Empty;
        public int Stock { get; set; }
    }

    [BsonIgnoreExtraElements]
    public class Product
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public List<string> Img { get; set; } = new List<string>();

        // REMOVED List<Review> Reviews - using separate collection now.

        public string Description { get; set; } = string.Empty;

        public List<string> Colors { get; set; } = new List<string>();

        // Changed from List<string> to List<ProductSize>
        public List<ProductSize> Sizes { get; set; } = new List<ProductSize>();

        // Added TotalStock
        public int TotalStock { get; set; }

        public Price ProductPrice { get; set; } = new Price();

        // New Rating Fields
        public double Rating { get; set; } = 0;
        public int ReviewCount { get; set; } = 0;

        [BsonRepresentation(BsonType.ObjectId)]
        public string Category { get; set; } = string.Empty;

        public string Gender { get; set; } = "Unisex";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    }
}