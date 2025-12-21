using API.Models;
using MongoDB.Driver;

namespace API.Repositories
{
    public class SliderRepository
    {
        private readonly IMongoCollection<Slider> _sliders;

        public SliderRepository(IDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);
            _sliders = database.GetCollection<Slider>("sliders");
        }

        public async Task<List<Slider>> GetAllAsync() =>
            await _sliders.Find(_ => true).SortBy(x => x.Order).ToListAsync();

        public async Task<Slider?> GetByIdAsync(string id) =>
            await _sliders.Find(x => x.Id == id).FirstOrDefaultAsync();

        public async Task CreateAsync(Slider slider) =>
            await _sliders.InsertOneAsync(slider);

        public async Task UpdateAsync(string id, Slider updatedSlider) =>
            await _sliders.ReplaceOneAsync(x => x.Id == id, updatedSlider);

        public async Task DeleteAsync(string id) =>
            await _sliders.DeleteOneAsync(x => x.Id == id);
    }
}
