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
        // POST: api/users/favorites
        [HttpPost("favorites")]
        [Authorize]
        public async Task<IActionResult> ToggleFavorite([FromBody] FavoriteItem item)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null) return NotFound("User not found.");

            var existingItem = user.Favorites.FirstOrDefault(f => 
                f.ProductId == item.ProductId && 
                f.Size == item.Size && 
                f.Color == item.Color);

            if (existingItem != null)
            {
                user.Favorites.Remove(existingItem);
                await _userRepository.UpdateAsync(userId, user);
                return Ok(new { message = "Removed from favorites", isFavorite = false });
            }
            else
            {
                user.Favorites.Add(item);
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

            if (user.Favorites == null || user.Favorites.Count == 0)
            {
                return Ok(new List<object>());
            }

            var productIds = user.Favorites.Select(f => f.ProductId).Distinct().ToList();
            var products = await _productRepository.GetByIdsAsync(productIds);

            var favoriteList = user.Favorites.Select(fav => {
                var product = products.FirstOrDefault(p => p.Id == fav.ProductId);
                if (product == null) return null;
                
                return new 
                {
                    _id = product.Id, 
                    id = product.Id,
                    name = product.Name,
                    img = product.Img,
                    productPrice = product.ProductPrice,
                    description = product.Description,
                    selectedSize = fav.Size,
                    selectedColor = fav.Color
                };
            }).Where(i => i != null).ToList();

            return Ok(favoriteList);
        }
    }
}
