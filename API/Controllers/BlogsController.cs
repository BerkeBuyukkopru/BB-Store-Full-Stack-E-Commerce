using API.Models;
using API.Repositories;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlogsController : ControllerBase
    {
        private readonly BlogRepository _blogRepository;
        private readonly ReviewRepository _reviewRepository;
        private readonly IHtmlSanitizationService _htmlSanitizer;

        public BlogsController(BlogRepository blogRepository, ReviewRepository reviewRepository, IHtmlSanitizationService htmlSanitizer)
        {
            _blogRepository = blogRepository;
            _reviewRepository = reviewRepository;
            _htmlSanitizer = htmlSanitizer;
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
            if (!MongoDB.Bson.ObjectId.TryParse(id, out _))
            {
                return BadRequest("Geçersiz ID formatı.");
            }

            var blog = await _blogRepository.GetByIdAsync(id);
            if (blog == null) return NotFound("Blog bulunamadı.");
            return Ok(blog);
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Create([FromBody] Blog blog)
        {
            blog.Content = _htmlSanitizer.Sanitize(blog.Content);
            await _blogRepository.CreateAsync(blog);
            return CreatedAtAction(nameof(GetById), new { id = blog.Id }, blog);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Update(string id, [FromBody] Blog blog)
        {
            if (!MongoDB.Bson.ObjectId.TryParse(id, out _))
            {
                return BadRequest("Geçersiz ID formatı.");
            }

            var existingBlog = await _blogRepository.GetByIdAsync(id);
            if (existingBlog == null) return NotFound("Blog not found.");

            blog.Id = existingBlog.Id;
            blog.Content = _htmlSanitizer.Sanitize(blog.Content);
            blog.CreatedAt = existingBlog.CreatedAt;
            blog.UpdatedAt = DateTime.UtcNow;

            await _blogRepository.UpdateAsync(id, blog);
            return Ok(blog);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Delete(string id)
        {
            if (!MongoDB.Bson.ObjectId.TryParse(id, out _))
            {
                return BadRequest("Geçersiz ID formatı.");
            }

            var existingBlog = await _blogRepository.GetByIdAsync(id);
            if (existingBlog == null) return NotFound("Blog not found.");

            await _blogRepository.DeleteAsync(id);
            await _reviewRepository.DeleteByTargetIdAsync(id);
            return Ok("Blog deleted successfully.");
        }
    }
}
