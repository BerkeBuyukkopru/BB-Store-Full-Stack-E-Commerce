using API.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace API.Repositories
{
    public class CargoCompanyRepository
    {
        private readonly IMongoCollection<CargoCompany> _cargoCompanies;

        public CargoCompanyRepository(IOptions<DatabaseSettings> mongoDbSettings)
        {
            var mongoClient = new MongoClient(mongoDbSettings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(mongoDbSettings.Value.DatabaseName);
            _cargoCompanies = mongoDatabase.GetCollection<CargoCompany>("CargoCompanies");
        }

        public async Task<List<CargoCompany>> GetAllAsync() =>
            await _cargoCompanies.Find(_ => true).ToListAsync();

        public async Task<CargoCompany> GetByIdAsync(Guid id) =>
            await _cargoCompanies.Find(x => x.Id == id).FirstOrDefaultAsync();

        public async Task CreateAsync(CargoCompany cargoCompany) =>
            await _cargoCompanies.InsertOneAsync(cargoCompany);

        public async Task UpdateAsync(Guid id, CargoCompany updatedCargoCompany) =>
            await _cargoCompanies.ReplaceOneAsync(x => x.Id == id, updatedCargoCompany);

        public async Task DeleteAsync(Guid id) =>
            await _cargoCompanies.DeleteOneAsync(x => x.Id == id);
    }
}
