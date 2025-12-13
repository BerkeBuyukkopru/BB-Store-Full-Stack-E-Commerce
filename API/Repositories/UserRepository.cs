using API.Models;
using MongoDB.Driver;

namespace API.Repositories
{
    public class UserRepository
    {
        private readonly IMongoCollection<User> _users;
        public UserRepository(IDatabaseSettings settings)
        {
            // Bağlantı dizesi ile istemciyi oluştur
            var client = new MongoClient(settings.ConnectionString);

            // Veritabanını seç
            var database = client.GetDatabase(settings.DatabaseName);

            // 'categories' koleksiyonunu temsil eden nesneyi oluştur
            _users = database.GetCollection<User>("users");
        }

        public async Task<User?> GetByEmailAsync(string email) =>
            await _users.Find(user => user.Email == email).FirstOrDefaultAsync();

        public async Task CreateAsync(User newUser)
        {
            newUser.CreatedAt = DateTime.UtcNow;
            newUser.UpdatedAt = DateTime.UtcNow;
            await _users.InsertOneAsync(newUser);
        }
    }
}