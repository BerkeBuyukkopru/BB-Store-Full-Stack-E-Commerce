using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace API.Models
{
    public class SiteSetting
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string LogoUrl { get; set; } = string.Empty;
        public string GlobalNotification { get; set; } = string.Empty;
        public string FooterPromotionTitle { get; set; } = string.Empty;
        public string FooterPromotionDescription { get; set; } = string.Empty;
        public string AboutUsPageContent { get; set; } = string.Empty;
        public string PrivacyPolicyPageContent { get; set; } = string.Empty;
    }
}
