using Microsoft.AspNetCore.Mvc;
using API.Models;
using API.Repositories;

[ApiController]
[Route("api/[controller]")]
public class CategoryController : ControllerBase
{
    private readonly CategoryRepository _categoryRepository;

    // Repository'yi Dependency Injection (DI) ile alıyoruz
    public CategoryController(CategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    // Node.js: router.post("/", ...) karşılığı
    // Rota: POST /api/category
    [HttpPost]
    public async Task<IActionResult> CreateCategory([FromBody] Category newCategory)
    {
        if (string.IsNullOrWhiteSpace(newCategory.Name) || string.IsNullOrWhiteSpace(newCategory.Img))
        {
            // HTTP 400 Bad Request
            return BadRequest("Kategori adı ve resim URL'si zorunludur.");
        }
        
        try
        {
            await _categoryRepository.CreateAsync(newCategory);
            // HTTP 201 Created yanıtı ile yeni objeyi döndürür
            return CreatedAtAction(nameof(Get), new { id = newCategory.Id }, newCategory);
        }
        catch (Exception ex)
        {
            // Geliştirme ortamında hatayı loglar ve HTTP 500 döndürür.
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    // Rota: GET /api/category
    [HttpGet]
    public async Task<ActionResult<List<Category>>> Get()
    {
        var categories = await _categoryRepository.GetAllAsync();
        
        return Ok(categories); 
    }
}