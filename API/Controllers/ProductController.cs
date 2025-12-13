using Microsoft.AspNetCore.Mvc;
using API.Models;
using API.Repositories;
using API.Dtos;
using Microsoft.AspNetCore.Authorization;

[ApiController]
[Route("api/[controller]")] // Temel Rota: /api/product
public class ProductController : ControllerBase
{
    private readonly ProductRepository _productRepository;

    // Repository'yi Dependency Injection ile alıyoruz
    public ProductController(ProductRepository productRepository)
    {
        _productRepository = productRepository;
    }

    // Rota: /api/product 
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
            Console.WriteLine($"Error creating product: {ex.Message}");
            return StatusCode(StatusCodes.Status500InternalServerError, new { error = "An internal server error occurred while creating the product." });
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
            Console.WriteLine($"Error retrieving products: {ex.Message}");
            return StatusCode(StatusCodes.Status500InternalServerError, new { error = "Internal server error." });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<List<Product>>> GetById(string id)
    {
        try
        {
            var product = await _productRepository.GetByIdAsync(id);

            if (product == null)
            {
                return NotFound(new { error = $"Ürün ID'si bulunamadı: {id}" });
            }

            return Ok(new List<Product> { product });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error retrieving product: {ex.Message}");
            return StatusCode(StatusCodes.Status500InternalServerError, new { error = "Internal server error." });
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
                return NotFound(new { error = $"Güncellenecek ürün ID'si bulunamadı: {id}" });
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

            await _productRepository.UpdateAsync(id, existingProduct);

            return Ok(existingProduct);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error updating product: {ex.Message}");
            return StatusCode(StatusCodes.Status500InternalServerError, new { error = "Internal server error." });
        }
    }


    // ProductController.cs içine eklenecek metot

    // Rota 5: DELETE /api/product/{id} (Ürün Silme)
    [HttpDelete("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Delete(string id)
    {
        try
        {
            var deletedProduct = await _productRepository.DeleteAsync(id);

            if (deletedProduct == null)
            {
                return NotFound(new { error = $"Silinecek ürün ID'si bulunamadı: {id}" });
            }

            return Ok(deletedProduct);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error deleting product: {ex.Message}");
            return StatusCode(StatusCodes.Status500InternalServerError, new { error = "Internal server error." });
        }
    }
}