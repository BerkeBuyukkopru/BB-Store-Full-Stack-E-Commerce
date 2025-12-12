using API.Models;
using MongoDB.Driver;

namespace API.Repositories
{
    public class CategoryRepository
    {
        private readonly IMongoCollection<Category> _categories;

        public CategoryRepository(IDatabaseSettings settings)
        {
            // Bağlantı dizesi ile istemciyi oluştur
            var client = new MongoClient(settings.ConnectionString);

            // Veritabanını seç
            var database = client.GetDatabase(settings.DatabaseName);

            // 'categories' koleksiyonunu temsil eden nesneyi oluştur
            _categories = database.GetCollection<Category>("categories");
        }
        public async Task CreateAsync(Category newCategory)
        {
            newCategory.CreatedAt = DateTime.UtcNow;
            newCategory.UpdatedAt = DateTime.UtcNow;
            await _categories.InsertOneAsync(newCategory);
        }

        public async Task<List<Category>> GetAllAsync() =>
            await _categories.Find(category => true).ToListAsync();

    }
}