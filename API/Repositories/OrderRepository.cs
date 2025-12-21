using API.Models;
using MongoDB.Driver;

namespace API.Repositories
{
    public class OrderRepository
    {
        private readonly IMongoCollection<Order> _orders;

        public OrderRepository(IDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);
            _orders = database.GetCollection<Order>("orders");
        }

        public async Task CreateAsync(Order newOrder)
        {
            await _orders.InsertOneAsync(newOrder);
        }

        public async Task<List<Order>> GetAllAsync() =>
            await _orders.Find(_ => true).SortByDescending(x => x.CreatedAt).ToListAsync();

        public async Task<Order?> GetByConversationIdAsync(string conversationId) =>
            await _orders.Find(x => x.ConversationId == conversationId).FirstOrDefaultAsync();

        public async Task<Order?> GetByBasketIdAsync(string basketId) =>
            await _orders.Find(x => x.BasketId == basketId).FirstOrDefaultAsync();

        public async Task UpdateAsync(string id, Order updatedOrder)
        {
            await _orders.ReplaceOneAsync(x => x.Id == id, updatedOrder);
        }

        public async Task<List<Order>> GetExpiredPendingOrdersAsync(DateTime threshold)
        {
            // Find orders where Status is "Pending" AND CreatedAt < threshold
            return await _orders.Find(x => x.Status == "Pending" && x.CreatedAt < threshold).ToListAsync();
        }
    }
}
