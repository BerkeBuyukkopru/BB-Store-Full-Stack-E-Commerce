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

    public ProductController(ProductRepository productRepository)
    {
        _productRepository = productRepository;
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
                Colors = productDto.Colors,
                Sizes = productDto.Sizes,
                ProductPrice = productDto.ProductPrice,
                Category = productDto.Category,

                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                Reviews = new List<Review>()
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
    public async Task<ActionResult<List<Product>>> Get()
    {
        try
        {
            var products = await _productRepository.GetAllAsync();
            
            return Ok(products);
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

            return Ok(new List<Product> { product });
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
                existingProduct.Colors = productUpdateDto.Colors;
            }
            if (productUpdateDto.Sizes != null)
            {
                existingProduct.Sizes = productUpdateDto.Sizes;
            }
            if (productUpdateDto.ProductPrice != null)
            {
                existingProduct.ProductPrice = productUpdateDto.ProductPrice;
            }
            if (productUpdateDto.Category != null)
            {
                existingProduct.Category = productUpdateDto.Category;
            }

           var isSuccessful= await _productRepository.UpdateAsync(id, existingProduct);

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
}