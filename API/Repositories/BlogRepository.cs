using API.Models;
using MongoDB.Driver;

namespace API.Repositories
{
    public class BlogRepository
    {
        private readonly IMongoCollection<Blog> _blogs;

        public BlogRepository(IDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);
            _blogs = database.GetCollection<Blog>("Blogs");
        }

        public async Task<List<Blog>> GetAllAsync()
        {
            return await _blogs.Find(blog => true).SortByDescending(b => b.CreatedAt).ToListAsync();
        }

        public async Task<Blog> GetByIdAsync(string id)
        {
            return await _blogs.Find(blog => blog.Id == id).FirstOrDefaultAsync();
        }

        public async Task CreateAsync(Blog blog)
        {
            await _blogs.InsertOneAsync(blog);
        }

        public async Task UpdateAsync(string id, Blog blog)
        {
            await _blogs.ReplaceOneAsync(b => b.Id == id, blog);
        }

        public async Task DeleteAsync(string id)
        {
            await _blogs.DeleteOneAsync(blog => blog.Id == id);
        }
    }
}
