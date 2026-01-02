using API.Models; // IDatabaseSettings ve Product Model'i için
using MongoDB.Bson;
using MongoDB.Driver;
using API.Dtos;
using System.Text.RegularExpressions;
using System.Linq;

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

        public async Task<List<Product>> GetAllAsync(ProductFilterParams filterParams)
        {
            var builder = Builders<Product>.Filter;
            var filter = builder.Empty;

            if (filterParams.Categories != null && filterParams.Categories.Any())
                filter &= builder.In(p => p.Category, filterParams.Categories);

            if (filterParams.Genders != null && filterParams.Genders.Any())
            {
                var targetGenders = new HashSet<string>(filterParams.Genders);

                if (targetGenders.Contains("Man") || targetGenders.Contains("Woman"))
                {
                    targetGenders.Add("Unisex");
                }

                filter &= builder.In(p => p.Gender, targetGenders);
            }

            if (filterParams.Colors != null && filterParams.Colors.Any())
                filter &= builder.AnyIn(p => p.Colors, filterParams.Colors);

            if (filterParams.Sizes != null && filterParams.Sizes.Any())
            {
                var sizeFilterBuilder = Builders<ProductSize>.Filter;
                var sizeFilter = sizeFilterBuilder.In(s => s.Size, filterParams.Sizes) & sizeFilterBuilder.Gt(s => s.Stock, 0);
                filter &= builder.ElemMatch(p => p.Sizes, sizeFilter);
            }

            var initialAggregate = _products.Aggregate().Match(filter);

            var addFieldsStage = new BsonDocument("$addFields", new BsonDocument
            {
                { "FinalPrice", new BsonDocument
                    {
                        { "$cond", new BsonArray
                            {
                                new BsonDocument("$gt", new BsonArray { "$ProductPrice.Discount", 0 }),
                                new BsonDocument("$subtract", new BsonArray
                                {
                                    "$ProductPrice.Current",
                                    new BsonDocument("$multiply", new BsonArray
                                    {
                                        "$ProductPrice.Current",
                                        new BsonDocument("$divide", new BsonArray { "$ProductPrice.Discount", 100 })
                                    })
                                }),
                                "$ProductPrice.Current"
                            }
                        }
                    }
                }
            });
            
            var aggregateWithPrice = initialAggregate.AppendStage<BsonDocument>(addFieldsStage);

            if (filterParams.MinPrice.HasValue)
            {
                aggregateWithPrice = aggregateWithPrice.Match(new BsonDocument("FinalPrice", new BsonDocument("$gte", filterParams.MinPrice.Value)));
            }
            if (filterParams.MaxPrice.HasValue)
            {
                aggregateWithPrice = aggregateWithPrice.Match(new BsonDocument("FinalPrice", new BsonDocument("$lte", filterParams.MaxPrice.Value)));
            }
            
            BsonDocument sortDef;
            switch (filterParams.SortBy)
            {
                case "price_asc":
                    sortDef = new BsonDocument("FinalPrice", 1);
                    break;
                case "price_desc":
                    sortDef = new BsonDocument("FinalPrice", -1);
                    break;
                case "newest":
                    sortDef = new BsonDocument("CreatedAt", -1);
                    break;
                case "a_z":
                    sortDef = new BsonDocument("Name", 1);
                    break;
                case "z_a":
                    sortDef = new BsonDocument("Name", -1);
                    break;
                case "rating":
                    sortDef = new BsonDocument("Rating", -1);
                    break;
                default:
                    sortDef = new BsonDocument("CreatedAt", -1);
                    break;
            }
            aggregateWithPrice = aggregateWithPrice.Sort(sortDef);

            return await aggregateWithPrice.As<Product>().ToListAsync();
        }

        public async Task<Dictionary<string, object>> GetFilterOptionsAsync()
        {
            var categories = await _products.Distinct(p => p.Category, Builders<Product>.Filter.Empty).ToListAsync();

            var genders = await _products.Distinct(p => p.Gender, Builders<Product>.Filter.Empty).ToListAsync();

            var priceStats = await _products.Aggregate()
                .Project(p => new 
                { 
                    FinalPrice = p.ProductPrice.Discount > 0 
                        ? p.ProductPrice.Current - (p.ProductPrice.Current * (decimal)p.ProductPrice.Discount / 100) 
                        : p.ProductPrice.Current 
                })
                .Group(p => 1, g => new
                { 
                    MinPrice = g.Min(p => p.FinalPrice), 
                    MaxPrice = g.Max(p => p.FinalPrice) 
                })
                .FirstOrDefaultAsync();

            var colors = await _products.Aggregate()
                .Unwind(p => p.Colors)
                .Group(new BsonDocument { { "_id", "$Colors" } })
                .ToListAsync();
            var colorList = colors.Select(c => c["_id"].AsString).OrderBy(c=>c).ToList();

            var sizes = await _products.Aggregate()
                .Unwind(p => p.Sizes)
                .Group(new BsonDocument { { "_id", "$Sizes.Size" } })
                .ToListAsync();
             var sizeList = sizes.Select(s => s["_id"].AsString).OrderBy(s => s).ToList();

             return new Dictionary<string, object>
             {
                 { "categories", categories },
                 { "genders", genders },
                 { "minPrice", priceStats != null ? priceStats.MinPrice : 0 },
                 { "maxPrice", priceStats != null ? priceStats.MaxPrice : 0 },
                 { "colors", colorList },
                 { "sizes", sizeList }
             };
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


        public async Task MigrateLegacySizesAsync()
        {
            var rawProducts = await _products.Database.GetCollection<BsonDocument>("products").Find(new BsonDocument()).ToListAsync();

            foreach (var doc in rawProducts)
            {
                if (doc.Contains("Sizes") && doc["Sizes"].IsBsonArray)
                {
                    var sizesArray = doc["Sizes"].AsBsonArray;
                    
                    if (sizesArray.Count > 0 && sizesArray[0].IsString)
                    {
                        var newSizesList = new BsonArray();
                        foreach (var size in sizesArray) 
                        {
                            var sizeObj = new BsonDocument
                            {
                                { "Size", size.AsString },
                                { "Stock", 5 }
                            };
                            newSizesList.Add(sizeObj);
                        }

                        var totalStock = newSizesList.Count * 5;

                        var updates = Builders<BsonDocument>.Update
                            .Set("Sizes", newSizesList)
                            .Set("TotalStock", totalStock);

                         await _products.Database.GetCollection<BsonDocument>("products").UpdateOneAsync(
                            new BsonDocument("_id", doc["_id"]),
                            updates
                        );
                    }
                }
            }
        }
        public async Task DecreaseStockAsync(List<API.Dtos.BasketItemDto> basketItems)
        {
            foreach (var item in basketItems)
            {
                if (item.Id == "Cargo" || !ObjectId.TryParse(item.Id, out _)) 
                {
                    continue;
                }

                var product = await GetByIdAsync(item.Id);
                if (product != null)
                {
                    var sizeToUpdate = product.Sizes.FirstOrDefault(s => s.Size == item.Size);
                    if (sizeToUpdate != null)
                    {
                        sizeToUpdate.Stock -= item.Quantity;
                        if (sizeToUpdate.Stock < 0) sizeToUpdate.Stock = 0;
                    }
                    
                    product.TotalStock = product.Sizes.Sum(s => s.Stock);

                    await UpdateAsync(product.Id!, product);
                }
            }
        }

        public async Task<long> GetCountByCategoryIdAsync(string categoryId)
        {
            return await _products.CountDocumentsAsync(p => p.Category == categoryId);
        }

        public async Task UpdateRatingAsync(string productId, double averageRating, int reviewCount)
        {
             var update = Builders<Product>.Update
                .Set(p => p.Rating, averageRating)
                .Set(p => p.ReviewCount, reviewCount);
             
             await _products.UpdateOneAsync(p => p.Id == productId, update);
        }
    }
}