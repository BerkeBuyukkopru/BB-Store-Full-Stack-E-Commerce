namespace API.Dtos
{
    public class PaymentRequestDto
    {
        public UserDto? User { get; set; }
        public API.Models.Address? Address { get; set; }
        public decimal CargoFee { get; set; }
        public List<BasketItemDto> BasketItems { get; set; } = new();
        public decimal TotalPrice { get; set; }
        
        // Card Details
        public string CardHolderName { get; set; } = string.Empty;
        public string CardNumber { get; set; } = string.Empty;
        public string ExpireMonth { get; set; } = string.Empty;
        public string ExpireYear { get; set; } = string.Empty;
        public string Cvc { get; set; } = string.Empty;
        public bool RegisterCard { get; set; } = false;
    }

    public class BasketItemDto
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Category { get; set; } = "General";
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public string Size { get; set; } = string.Empty;
        public string Color { get; set; } = string.Empty;
        public List<string> Img { get; set; } = new();
    }
}
