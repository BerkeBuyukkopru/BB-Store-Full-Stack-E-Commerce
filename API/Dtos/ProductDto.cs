using API.Models; 
using System.ComponentModel.DataAnnotations;

namespace API.Dtos
{
    public class ProductDto
    {
        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public List<string> Img { get; set; } = new List<string>();

        [Required]
        public string Description { get; set; } = string.Empty;

        [Required]
        public List<string> Colors { get; set; } = new List<string>();

        [Required]
        public List<string> Sizes { get; set; } = new List<string>();

        [Required]
        public Price ProductPrice { get; set; } = new Price(); 

        [Required]
        public string Category { get; set; } = string.Empty;
    }
}