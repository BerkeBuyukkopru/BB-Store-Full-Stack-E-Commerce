using Microsoft.AspNetCore.Mvc;
using API.Models;
using API.Repositories;
using API.Dtos;
using Microsoft.AspNetCore.Authorization;

[ApiController]
[Route("api/[controller]")]
public class CouponController : ControllerBase
{
    private readonly CouponRepository _couponRepository;

    public CouponController(CouponRepository couponRepository)
    {
        _couponRepository = couponRepository;
    }

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
                return BadRequest(new { error = "Bu Kupon Zaten Var." });
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
            Console.WriteLine(ex.Message);
            return StatusCode(500, new { error = "Internal server error." });
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
            Console.WriteLine(ex.Message);
            return StatusCode(500, new { error = "Internal server error." });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Coupon>> GetById(string id)
    {
        try
        {
            var coupon = await _couponRepository.GetByIdAsync(id);

            if (coupon == null)
            {
                return NotFound(new { error = "Ürün  bulunamadı." });
            }

            return Ok(new List<Coupon> { coupon });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);

            return StatusCode(500, new { error = "Internal server error." });
        }
    }
    [HttpGet("code/{couponCode}")]
    public async Task<IActionResult> GetByCode(string couponCode)
    {
        try
        {
            var coupon = await _couponRepository.GetByCodeAsync(couponCode);

            if (coupon == null)
            {
                return NotFound(new { error = "Kupon Bulunamadı." });
            }

            return Ok(new { discountPercent = coupon.DiscountPercent });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);

            return StatusCode(500, new { error = "Server error." });
        }
    }

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
                return NotFound(new { error = "Kupon Bulunamadı." });
            }

            if (couponUpdateDto.Code != null)
            {
                existingCoupon.Code = couponUpdateDto.Code;
            }

            if (couponUpdateDto.DiscountPercent.HasValue)
            {
                existingCoupon.DiscountPercent = couponUpdateDto.DiscountPercent.Value;
            }

            var isSuccessful = await _couponRepository.UpdateAsync(id, existingCoupon);

            if (!isSuccessful)
            {
                return StatusCode(500, new { error = "Güncelleme başarılı olamadı." });
            }
            return Ok(existingCoupon);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            return StatusCode(500, new { error = "Server error." });
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Delete(string id)
    {
        try
        {
            var deletedCoupon = await _couponRepository.DeleteAsync(id);

            if (deletedCoupon == null)
            {
                return NotFound(new { error = "Silinecek Kupon Bulunamadı." });
            }

            return Ok(deletedCoupon);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            return StatusCode(500, new { error = "Server Error" });
        }
    }
}