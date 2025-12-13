using System.ComponentModel.DataAnnotations;

namespace API.Dtos
{
    public class CouponDto
    {
        [Required(ErrorMessage = "Kupon kodu zorunludur.")]
        public string Code { get; set; } = string.Empty;

        [Required(ErrorMessage = "İndirim oranı zorunludur.")]
        [Range(1, 100, ErrorMessage = "İndirim oranı 1 ile 100 arasında olmalıdır.")]
        public int DiscountPercent { get; set; }
    }
}