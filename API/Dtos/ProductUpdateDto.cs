using API.Models; // ProductPrice ve diğer alt modeller için

namespace API.Dtos
{
    public class ProductUpdateDto
    {
        public string? Name { get; set; }
        public List<string>? Img { get; set; }
        public string? Description { get; set; }
        public List<string>? Colors { get; set; }
        public List<string>? Sizes { get; set; }
        public Price? ProductPrice { get; set; }
        public string? Category { get; set; }
    }
}