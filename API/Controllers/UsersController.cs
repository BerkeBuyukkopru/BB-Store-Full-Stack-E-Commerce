using API.Models;
using API.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserRepository _userRepository;
        private readonly ProductRepository _productRepository;

        public UsersController(UserRepository userRepository, ProductRepository productRepository)
        {
            _userRepository = userRepository;
            _productRepository = productRepository;
        }

        // POST: api/users/favorites
        [HttpPost("favorites")]
        [Authorize]
        public async Task<IActionResult> ToggleFavorite([FromBody] string productId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null) return NotFound("User not found.");

            if (user.FavoriteProductIds.Contains(productId))
            {
                user.FavoriteProductIds.Remove(productId);
                await _userRepository.UpdateAsync(userId, user);
                return Ok(new { message = "Removed from favorites", isFavorite = false });
            }
            else
            {
                user.FavoriteProductIds.Add(productId);
                await _userRepository.UpdateAsync(userId, user);
                return Ok(new { message = "Added to favorites", isFavorite = true });
            }
        }

        // GET: api/users/favorites
        [HttpGet("favorites")]
        [Authorize]
        public async Task<IActionResult> GetFavorites()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null) return NotFound("User not found.");

            if (user.FavoriteProductIds == null || user.FavoriteProductIds.Count == 0)
            {
                return Ok(new List<Product>());
            }

            var favoriteProducts = await _productRepository.GetByIdsAsync(user.FavoriteProductIds);

            return Ok(favoriteProducts);
        }
    }
}
