using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using API.Dtos;

namespace API.Models
{
    public class Order
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string OrderNumber { get; set; } = Guid.NewGuid().ToString().Substring(0, 8).ToUpper();

        public UserDto? User { get; set; }

        public List<BasketItemDto> BasketItems { get; set; } = new();

        public decimal TotalPrice { get; set; }

        public string Status { get; set; } = "Pending"; // Pending, Success, Failed

        public string PaymentId { get; set; } = string.Empty;
        public string ConversationId { get; set; } = string.Empty;
        public string BasketId { get; set; } = string.Empty;

        public Address? Address { get; set; }
        public decimal CargoFee { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
