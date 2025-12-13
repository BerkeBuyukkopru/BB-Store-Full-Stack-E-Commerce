using Microsoft.AspNetCore.Mvc;
using API.Models;
using API.Repositories;
using API.Dtos;
using Microsoft.AspNetCore.Authorization;

[ApiController]
[Route("api/[controller]")] // Temel Rota: /api/coupon
public class CouponController : ControllerBase
{
    private readonly CouponRepository _couponRepository;

    // Repository'yi Dependency Injection ile alıyoruz
    public CouponController(CouponRepository couponRepository)
    {
        _couponRepository = couponRepository;
    }

    // Rota: POST /api/coupon 
    [HttpPost]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Create([FromBody] CouponDto couponDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var existingCoupon = await _couponRepository.GetByCodeAsync(couponDto.Code);
            if (existingCoupon != null)
            {
                return BadRequest(new { error = "This coupon is already exists." }); // Kursun hata mesajına uyuldu
            }
            var newCoupon = new Coupon
            {
                Code = couponDto.Code,
                DiscountPercent = couponDto.DiscountPercent,

                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _couponRepository.CreateAsync(newCoupon);

            // 201 Created yanıtı döndürülür
            return CreatedAtAction(nameof(Create), new { id = newCoupon.Id }, newCoupon);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error creating coupon: {ex.Message}");
            return StatusCode(StatusCodes.Status500InternalServerError, new { error = "An internal server error occurred while creating the coupon." });
        }
    }

    [HttpGet]
    public async Task<ActionResult<List<Coupon>>> Get()
    {
        try
        {
            var coupons = await _couponRepository.GetAllAsync();
            return Ok(coupons);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error retrieving coupons: {ex.Message}");
            return StatusCode(StatusCodes.Status500InternalServerError, new { error = "Internal server error." });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<List<Coupon>>> GetById(string id)
    {
        try
        {
            var coupon = await _couponRepository.GetByIdAsync(id);

            if (coupon == null)
            {
                return NotFound(new { error = $"Ürün ID'si bulunamadı: {id}" });
            }

            return Ok(new List<Coupon> { coupon });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error retrieving product: {ex.Message}");
            return StatusCode(StatusCodes.Status500InternalServerError, new { error = "Internal server error." });
        }
    }
    [HttpGet("code/{couponCode}")]
    public async Task<IActionResult> GetByCode(string couponCode)
    {
        try
        {
            var coupon = await _couponRepository.GetByCodeAsync(couponCode);

            // Kupon bulunamazsa 404 döndür (Kurs mantığı)
            if (coupon == null)
            {
                return NotFound(new { error = "Coupon not found." });
            }

            // Kurs, sadece indirim yüzdesini döndürmeyi talep ediyor.
            return Ok(new { discountPercent = coupon.DiscountPercent });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error retrieving coupon by code: {ex.Message}");
            return StatusCode(StatusCodes.Status500InternalServerError, new { error = "Internal server error." });
        }
    }

    // CouponController.cs içine eklenecek metot

    // Rota 5: PUT /api/coupon/{id} (Kupon Güncelleme)
    [HttpPut("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Update(string id, [FromBody] CouponUpdateDto couponUpdateDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var existingCoupon = await _couponRepository.GetByIdAsync(id);
            if (existingCoupon == null)
            {
                return NotFound(new { error = "Coupon not found." });
            }

            if (couponUpdateDto.Code != null)
            {
                existingCoupon.Code = couponUpdateDto.Code;
            }

            if (couponUpdateDto.DiscountPercent.HasValue)
            {
                existingCoupon.DiscountPercent = couponUpdateDto.DiscountPercent.Value;
            }

            await _couponRepository.UpdateAsync(id, existingCoupon);

            return Ok(existingCoupon);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error updating coupon: {ex.Message}");
            return StatusCode(StatusCodes.Status500InternalServerError, new { error = "Server error." });
        }
    }

    // CouponController.cs içine eklenecek metot

    // Rota 6: DELETE /api/coupon/{id} (Kupon Silme)
    [HttpDelete("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Delete(string id)
    {
        try
        {
            var deletedCoupon = await _couponRepository.DeleteAsync(id);

            if (deletedCoupon == null)
            {
                return NotFound(new { error = "Coupon not found." });
            }

            return Ok(deletedCoupon);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error deleting coupon: {ex.Message}");
            return StatusCode(StatusCodes.Status500InternalServerError, new { error = "Server error." });
        }
    }
}