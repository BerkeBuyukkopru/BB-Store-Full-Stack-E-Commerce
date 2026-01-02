using API.Models;
using MongoDB.Driver;

namespace API.Repositories
{
    public class ReviewRepository
    {
        private readonly IMongoCollection<Review> _reviews;

        public ReviewRepository(IDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);
            _reviews = database.GetCollection<Review>("reviews");
        }

        public async Task<Review> CreateAsync(Review review)
        {
            await _reviews.InsertOneAsync(review);
            return review;
        }

        public async Task<List<Review>> GetByTargetIdAsync(string targetId)
        {
            return await _reviews.Find(r => r.TargetId == targetId).SortByDescending(r => r.CreatedAt).ToListAsync();
        }

        public async Task<List<Review>> GetByUserIdAsync(string userId)
        {
            return await _reviews.Find(r => r.UserId == userId).SortByDescending(r => r.CreatedAt).ToListAsync();
        }

        public async Task<List<Review>> GetAllAsync()
        {
            return await _reviews.Find(_ => true).SortByDescending(r => r.CreatedAt).ToListAsync();
        }

        public async Task<Review?> GetByIdAsync(string id)
        {
             return await _reviews.Find(r => r.Id == id).FirstOrDefaultAsync();
        }

        public async Task DeleteAsync(string id)
        {
            await _reviews.DeleteOneAsync(r => r.Id == id);
        }

        public async Task DeleteByTargetIdAsync(string targetId)
        {
            await _reviews.DeleteManyAsync(r => r.TargetId == targetId);
        }

        public async Task<bool> HasUserReviewedAsync(string userId, string targetId)
        {
            return await _reviews.Find(r => r.UserId == userId && r.TargetId == targetId).AnyAsync();
        }
    }
}
