using System.ComponentModel.DataAnnotations;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace API.Models
{

    public enum UserRole
    {
        user,
        admin
    }

    [BsonIgnoreExtraElements]
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Surname { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string AvatarUrl { get; set; } = string.Empty;

        public string Password { get; set; } = string.Empty;

        [BsonRepresentation(BsonType.String)]
        public UserRole Role { get; set; } = UserRole.user;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public List<Address> Addresses { get; set; } = new List<Address>();

        public List<FavoriteItem> Favorites { get; set; } = new List<FavoriteItem>();
    }

}