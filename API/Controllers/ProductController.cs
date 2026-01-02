using Microsoft.AspNetCore.Mvc;
using API.Models;
using API.Repositories;
using API.Dtos;
using Microsoft.AspNetCore.Authorization;

[ApiController]
[Route("api/[controller]")]
public class ProductController : ControllerBase
{
    private readonly ProductRepository _productRepository;
    private readonly ReviewRepository _reviewRepository;

    public ProductController(ProductRepository productRepository, ReviewRepository reviewRepository)
    {
        _productRepository = productRepository;
        _reviewRepository = reviewRepository;
    }

    [HttpPost]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Create([FromBody] ProductDto productDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var newProduct = new Product
            {
                Name = productDto.Name,
                Description = productDto.Description,
                Img = productDto.Img,
                Colors = productDto.Colors.Select(c => System.Globalization.CultureInfo.CurrentCulture.TextInfo.ToTitleCase(c.ToLower())).ToList(),
                Sizes = productDto.Sizes,
                TotalStock = productDto.Sizes.Sum(s => s.Stock),
                ProductPrice = productDto.ProductPrice,
                Category = productDto.Category,
                Gender = productDto.Gender,

                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _productRepository.CreateAsync(newProduct);

            return CreatedAtAction(nameof(Create), new { id = newProduct.Id }, newProduct);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            return StatusCode(500, new { error = "Internal server error." });
        }
    }

    [HttpGet]
    public async Task<ActionResult<List<Product>>> Get([FromQuery] ProductFilterParams filterParams)
    {
        try
        {
            var products = await _productRepository.GetAllAsync(filterParams);

            return Ok(products);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);

            return StatusCode(500, new { error = "Internal server error." });
        }
    }

    [HttpGet("filter-options")]
    public async Task<IActionResult> GetFilterOptions()
    {
        try
        {
             var options = await _productRepository.GetFilterOptionsAsync();
             return Ok(options);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            return StatusCode(500, new { error = "Internal server error." });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Product>> GetById(string id)
    {
        try
        {
            var product = await _productRepository.GetByIdAsync(id);

            if (product == null)
            {
                return NotFound(new { error = "Ürün bulunamadı" });
            }

            return Ok(product);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);

            return StatusCode(500, new { error = "Server error." });
        }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Update(string id, [FromBody] ProductUpdateDto productUpdateDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var existingProduct = await _productRepository.GetByIdAsync(id);
            if (existingProduct == null)
            {
                return NotFound(new { error = "Güncellenecek ürün  bulunamadı" });
            }

            if (productUpdateDto.Name != null)
            {
                existingProduct.Name = productUpdateDto.Name;
            }
            if (productUpdateDto.Description != null)
            {
                existingProduct.Description = productUpdateDto.Description;
            }
            if (productUpdateDto.Img != null)
            {
                existingProduct.Img = productUpdateDto.Img;
            }

            if (productUpdateDto.Colors != null)
            {
                existingProduct.Colors = productUpdateDto.Colors.Select(c => System.Globalization.CultureInfo.CurrentCulture.TextInfo.ToTitleCase(c.ToLower())).ToList();
            }
            if (productUpdateDto.Sizes != null)
            {
                existingProduct.Sizes = productUpdateDto.Sizes;
                existingProduct.TotalStock = existingProduct.Sizes.Sum(s => s.Stock);
            }
            if (productUpdateDto.ProductPrice != null)
            {
                existingProduct.ProductPrice = productUpdateDto.ProductPrice;
            }
            if (productUpdateDto.Category != null)
            {
                existingProduct.Category = productUpdateDto.Category;
            }
            if (productUpdateDto.Gender != null)
            {
                existingProduct.Gender = productUpdateDto.Gender;
            }

            var isSuccessful = await _productRepository.UpdateAsync(id, existingProduct);

            if (!isSuccessful)
            {
                return StatusCode(500, new { error = "Güncelleme başarılı olamadı." });
            }
            return Ok(existingProduct);
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
            var deletedProduct = await _productRepository.DeleteAsync(id);

            if(deletedProduct != null) 
            {
                await _reviewRepository.DeleteByTargetIdAsync(id);
            }

            if (deletedProduct == null)
            {
                return NotFound(new { error = "Silinecek ürün ID'si bulunamadı." });
            }

            return Ok(deletedProduct);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            return StatusCode(500, new { error = "Server Error" });
        }
    }


    [HttpGet("search/{productName}")]
    public async Task<ActionResult<List<Product>>> Search(string productName)
    {
        try
        {
            // Boş arama kontrolü
            if (string.IsNullOrWhiteSpace(productName))
            {
                return BadRequest(new { error = "Lütfen aranacak ürünün adını giriniz." });
            }

            // Repository üzerinden MongoDB sorgusunu çalıştır
            var products = await _productRepository.SearchByNameAsync(productName);

            // Sonuçları dön
            return Ok(products);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            return StatusCode(500, new { error = "Arama işlemi sırasında sunucu hatası oluştu." });
        }
    }
}