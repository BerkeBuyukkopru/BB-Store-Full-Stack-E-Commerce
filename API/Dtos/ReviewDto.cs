using System.ComponentModel.DataAnnotations;

namespace API.Dtos
{
    public class CreateReviewDto
    {
        [Required]
        public string TargetId { get; set; } = string.Empty;

        public string TargetType { get; set; } = "Product"; 

        public string Comment { get; set; } = string.Empty;

        public int Rating { get; set; }
    }

    public class ReviewResponseDto
    {
        public string Id { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty; 
        public string UserImg { get; set; } = string.Empty; 
        public string TargetId { get; set; } = string.Empty;
        public string TargetType { get; set; } = string.Empty;
        public string TargetName { get; set; } = string.Empty; 
        public string TargetImage { get; set; } = string.Empty; 

        public string Comment { get; set; } = string.Empty;
        public int Rating { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}