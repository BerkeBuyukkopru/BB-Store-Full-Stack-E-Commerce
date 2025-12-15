using API.Models;
using MongoDB.Driver;

namespace API.Repositories
{
    public class UserRepository
    {
        private readonly IMongoCollection<User> _users;
        public UserRepository(IDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);

            var database = client.GetDatabase(settings.DatabaseName);

            _users = database.GetCollection<User>("users");
        }

        public async Task<User?> GetByIdAsync(string id)
        {
            return await _users.Find(user => user.Id == id).FirstOrDefaultAsync();
        }
        public async Task<User?> GetByEmailAsync(string email) =>
            await _users.Find(user => user.Email == email).FirstOrDefaultAsync();

        public async Task CreateAsync(User newUser)
        {
            await _users.InsertOneAsync(newUser);
        }
    }
}