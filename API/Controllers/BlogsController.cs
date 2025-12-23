using API.Models;
using API.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlogsController : ControllerBase
    {
        private readonly BlogRepository _blogRepository;

        public BlogsController(BlogRepository blogRepository)
        {
            _blogRepository = blogRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var blogs = await _blogRepository.GetAllAsync();
            return Ok(blogs);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var blog = await _blogRepository.GetByIdAsync(id);
            if (blog == null) return NotFound("Blog not found.");
            return Ok(blog);
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Create([FromBody] Blog blog)
        {
            await _blogRepository.CreateAsync(blog);
            return CreatedAtAction(nameof(GetById), new { id = blog.Id }, blog);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Update(string id, [FromBody] Blog blog)
        {
            var existingBlog = await _blogRepository.GetByIdAsync(id);
            if (existingBlog == null) return NotFound("Blog not found.");

            blog.Id = existingBlog.Id;
            blog.CreatedAt = existingBlog.CreatedAt; // Keep original creation date
            blog.UpdatedAt = DateTime.UtcNow;

            await _blogRepository.UpdateAsync(id, blog);
            return Ok(blog);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Delete(string id)
        {
            var existingBlog = await _blogRepository.GetByIdAsync(id);
            if (existingBlog == null) return NotFound("Blog not found.");

            await _blogRepository.DeleteAsync(id);
            return Ok("Blog deleted successfully.");
        }
    }
}
