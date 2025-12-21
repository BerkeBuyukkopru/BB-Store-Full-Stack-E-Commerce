using API.Models; // IDatabaseSettings ve Product Model'i için
using MongoDB.Bson;
using MongoDB.Driver;

namespace API.Repositories
{
    public class ProductRepository
    {
        private readonly IMongoCollection<Product> _products;

        public ProductRepository(IDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);

            var database = client.GetDatabase(settings.DatabaseName);

            _products = database.GetCollection<Product>("products");
        }

        public async Task<Product> CreateAsync(Product product)
        {
            await _products.InsertOneAsync(product);
            return product;
        }

        public async Task<List<Product>> GetAllAsync()
        {
            return await _products.Find(product => true).ToListAsync();
        }
        public async Task<Product?> GetByIdAsync(string id)
        {
            return await _products.Find(products => products.Id == id).FirstOrDefaultAsync();
        }


        public async Task<bool> UpdateAsync(string id, Product updatedProduct)
        {
            updatedProduct.UpdatedAt = DateTime.UtcNow;
            updatedProduct.Id = id;

            var result = await _products.ReplaceOneAsync(product => product.Id == id, updatedProduct);

            return result.IsAcknowledged && result.ModifiedCount > 0;
        }
        public async Task<Product?> DeleteAsync(string id)
        {
            return await _products.FindOneAndDeleteAsync(product => product.Id == id);
        }


        public async Task<List<Product>> SearchByNameAsync(string productName)
        {
            var filter = Builders<Product>.Filter.Regex(p => p.Name, new BsonRegularExpression(productName, "i"));

            return await _products.Find(filter).ToListAsync();
        }

        public async Task<List<Product>> GetByIdsAsync(List<string> ids)
        {
            var filter = Builders<Product>.Filter.In(p => p.Id, ids);
            return await _products.Find(filter).ToListAsync();
        }

    }
}