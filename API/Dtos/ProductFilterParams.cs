using System.Collections.Generic;

namespace API.Dtos
{
    public class ProductFilterParams
    {
        public List<string>? Categories { get; set; }
        public List<string>? Genders { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public List<string>? Colors { get; set; }
        public List<string>? Sizes { get; set; }
        public string? SortBy { get; set; } 
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 12;
    }
}
