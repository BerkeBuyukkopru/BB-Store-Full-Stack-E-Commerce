using API.Dtos;
using API.Models;
using API.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReviewsController : ControllerBase
    {
        private readonly ReviewRepository _reviewRepository;
        private readonly ProductRepository _productRepository;
        private readonly UserRepository _userRepository;

        public ReviewsController(ReviewRepository reviewRepository, ProductRepository productRepository, UserRepository userRepository)
        {
            _reviewRepository = reviewRepository;
            _productRepository = productRepository;
            _userRepository = userRepository;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateReview([FromBody] CreateReviewDto createReviewDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var review = new Review
            {
                UserId = userId,
                TargetId = createReviewDto.TargetId,
                TargetType = createReviewDto.TargetType,
                Comment = createReviewDto.Comment,
                Rating = createReviewDto.Rating,
                CreatedAt = DateTime.UtcNow
            };

            await _reviewRepository.CreateAsync(review);

            // Update Product Rating logic if it's a product
            if (createReviewDto.TargetType == "Product")
            {
               await UpdateProductRating(createReviewDto.TargetId);
            }

            return Ok(review);
        }

        [HttpGet("product/{productId}")]
        public async Task<IActionResult> GetProductReviews(string productId)
        {
            var reviews = await _reviewRepository.GetByTargetIdAsync(productId);
            var response = await MapToDto(reviews);
            return Ok(response);
        }

        [HttpGet("blog/{blogId}")]
        public async Task<IActionResult> GetBlogReviews(string blogId)
        {
            var reviews = await _reviewRepository.GetByTargetIdAsync(blogId);
            var response = await MapToDto(reviews);
            return Ok(response);
        }

        [HttpGet("my-reviews")]
        [Authorize]
        public async Task<IActionResult> GetMyReviews()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var reviews = await _reviewRepository.GetByUserIdAsync(userId);
             // We might want to enrich this with Product Name / Blog Title in future, but for now basic info
            return Ok(reviews);
        }

        [HttpGet("admin/all")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> GetAllReviews()
        {
            var reviews = await _reviewRepository.GetAllAsync();
            var response = await MapToDto(reviews);
            return Ok(response);
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteReview(string id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var role = User.FindFirstValue(ClaimTypes.Role);

            var review = await _reviewRepository.GetByIdAsync(id);
            if (review == null) return NotFound();

            // Allow delete if User is Owner OR User is Admin
            if (review.UserId != userId && role != "admin")
            {
                return Forbid();
            }

            await _reviewRepository.DeleteAsync(id);

            if (review.TargetType == "Product")
            {
                await UpdateProductRating(review.TargetId);
            }

            return Ok(new { message = "Yorum silindi." });
        }

        // Helper to recalculate and update product rating
        private async Task UpdateProductRating(string productId)
        {
            var reviews = await _reviewRepository.GetByTargetIdAsync(productId);
            if (reviews.Any())
            {
                var average = reviews.Average(r => r.Rating);
                var count = reviews.Count;
                await _productRepository.UpdateRatingAsync(productId, average, count);
            }
            else
            {
                await _productRepository.UpdateRatingAsync(productId, 0, 0);
            }
        }

        // Helper to map Review to DTO with User info
        private async Task<List<ReviewResponseDto>> MapToDto(List<Review> reviews)
        {
            var dtos = new List<ReviewResponseDto>();
            foreach (var r in reviews)
            {
                // Fetch user info
                var user = await _userRepository.GetByIdAsync(r.UserId);
                
                dtos.Add(new ReviewResponseDto
                {
                    Id = r.Id!,
                    UserId = r.UserId,
                    UserName = FormatUserDisplayName(user),
                    UserImg = user?.AvatarUrl ?? "/default-avatar.png",
                    TargetId = r.TargetId,
                    TargetType = r.TargetType,
                    Comment = r.Comment,
                    Rating = r.Rating,
                    CreatedAt = r.CreatedAt
                });
            }
            return dtos;
        }
        private string FormatUserDisplayName(User? user)
        {
            if (user == null) return "Misafir";
            if (string.IsNullOrEmpty(user.Surname)) return user.Name;

            return $"{user.Name} {user.Surname.Trim().Substring(0, 1).ToUpper()}.";
        }
    }
}
