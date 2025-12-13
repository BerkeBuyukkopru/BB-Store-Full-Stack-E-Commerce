using API.Models; // IDatabaseSettings ve Product Model'i için
using MongoDB.Driver;

namespace API.Repositories
{
    public class CouponRepository
    {
        private readonly IMongoCollection<Coupon> _coupons;

        public CouponRepository(IDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);

            var database = client.GetDatabase(settings.DatabaseName);

            _coupons = database.GetCollection<Coupon>("coupons");
        }
        public async Task<Coupon?> GetByCodeAsync(string code)
        {
            return await _coupons.Find(coupon => coupon.Code == code).FirstOrDefaultAsync();
        }
        public async Task<Coupon> CreateAsync(Coupon coupon)
        {
            await _coupons.InsertOneAsync(coupon);
            return coupon;
        }

        public async Task<List<Coupon>> GetAllAsync()
        {
            return await _coupons.Find(coupon => true).ToListAsync();
        }
        public async Task<Coupon?> GetByIdAsync(string id)
        {
            return await _coupons.Find(coupons => coupons.Id == id).FirstOrDefaultAsync();
        }

        public async Task<bool> UpdateAsync(string id, Coupon updatedCoupon)
        {
            updatedCoupon.UpdatedAt = DateTime.UtcNow;
            updatedCoupon.Id = id;

            var result = await _coupons.ReplaceOneAsync(coupon => coupon.Id == id, updatedCoupon);

            return result.IsAcknowledged && result.ModifiedCount > 0;
        }

        public async Task<Coupon?> DeleteAsync(string id)
        {
            return await _coupons.FindOneAndDeleteAsync(coupon => coupon.Id == id);
        }
    }
}