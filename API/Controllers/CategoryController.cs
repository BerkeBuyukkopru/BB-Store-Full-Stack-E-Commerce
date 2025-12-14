using Microsoft.AspNetCore.Mvc;
using API.Models;
using API.Repositories;
using API.Dtos;
using Microsoft.AspNetCore.Authorization;

[ApiController]
[Route("api/[controller]")]
public class CategoryController : ControllerBase
{
    private readonly CategoryRepository _categoryRepository;

    public CategoryController(CategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    [HttpPost]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Create([FromBody] CategoryDto categoryDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var newCategory = new Category
            {
                Name = categoryDto.Name,
                Img = categoryDto.Img,

                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _categoryRepository.CreateAsync(newCategory);

            return CreatedAtAction(nameof(Get), new { id = newCategory.Id }, newCategory);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            return StatusCode(500, new { error = "Internal server error." });
        }
    }

    [HttpGet]
    public async Task<ActionResult<List<Category>>> Get()
    {
        try
        {
            var categories = await _categoryRepository.GetAllAsync();

            return Ok(categories);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);

            return StatusCode(500, new { error = "Internal server error." });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Category>> GetById(string id)
    {
        try
        {
            // Kategorileri Repository'den çekiyoruz
            var category = await _categoryRepository.GetByIdAsync(id);

            if (category == null)
            {
                return NotFound(new { error = "Kategori Bulunamadı." });
            }

            return Ok(category);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);

            return StatusCode(500, new { error = "Server error." });
        }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "admin")] 
    public async Task<IActionResult> Update(string id, [FromBody] CategoryUpdateDto categoryUpdateDto)
    {
        if (!ModelState.IsValid) 
        {
            return BadRequest(ModelState);
        }

        try
        {
            var existingCategory = await _categoryRepository.GetByIdAsync(id);
            if (existingCategory == null)
            {
                return NotFound(new { error = "Kategori bulunamadı." });
            }

            if (categoryUpdateDto.Name != null)
            {
                existingCategory.Name = categoryUpdateDto.Name;
            }
            if (categoryUpdateDto.Img != null)
            {
                existingCategory.Img = categoryUpdateDto.Img;
            }

            var isSuccessful = await _categoryRepository.UpdateAsync(id, existingCategory);

            if (!isSuccessful)
            {
                return StatusCode(500, new { error = "Güncelleme başarılı olamadı." });
            }
            return Ok(existingCategory);
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
            var deletedCategory = await _categoryRepository.DeleteAsync(id);

            if (deletedCategory == null)
            {
                return NotFound(new { error = "Silinecek Kategori Bulunamadı." });
            }

            return Ok(deletedCategory);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            return StatusCode(500, new { error = "Server Error" });
        }
    }
}
