using API.Models;
using MongoDB.Driver;

namespace API.Repositories
{
    public class SiteSettingRepository
    {
        private readonly IMongoCollection<SiteSetting> _settings;

        public SiteSettingRepository(IDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);
            _settings = database.GetCollection<SiteSetting>("site_settings");
        }

        public async Task<SiteSetting> GetAsync()
        {
            var setting = await _settings.Find(_ => true).FirstOrDefaultAsync();
            if (setting == null)
            {
                setting = new SiteSetting
                {
                    LogoUrl = "logo.png",
                    GlobalNotification = "THEME FAQ'S",
                    FooterPromotionTitle = "Shop & Call Us",
                    FooterPromotionDescription = "Lorem ipsum dolor sit amet."
                };
                await _settings.InsertOneAsync(setting);
            }
            return setting;
        }

        public async Task UpdateAsync(SiteSetting updatedSetting)
        {
            var existing = await GetAsync();
            updatedSetting.Id = existing.Id;
            await _settings.ReplaceOneAsync(x => x.Id == existing.Id, updatedSetting);
        }
    }
}
