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
            await _categories.InsertOneAsync(newCategory);
        }

        public async Task<List<Category>> GetAllAsync() =>
            await _categories.Find(category => true).ToListAsync();


        public async Task<Category?> GetByIdAsync(string id) =>
            await _categories.Find(category => category.Id == id).FirstOrDefaultAsync();

        public async Task<bool> UpdateAsync(string id, Category updatedCategory)
        {
            // Güncelleme zaman damgasını ayarla
            updatedCategory.UpdatedAt = DateTime.UtcNow;

            // Belgeyi ID'ye göre bul ve verilen yeni nesneyle değiştir 
            updatedCategory.Id = id;

            var result = await _categories.ReplaceOneAsync(
                category => category.Id == id,
                updatedCategory
            );
            return result.IsAcknowledged && result.ModifiedCount > 0;
        }

        public async Task<Category?> DeleteAsync(string id)
        {
            return await _categories.FindOneAndDeleteAsync(category => category.Id ==id);
        }
    }
}