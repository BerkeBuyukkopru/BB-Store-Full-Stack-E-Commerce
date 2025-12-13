using API.Models;
using API.Repositories;
using API.Services; // ITokenService ve TokenService için
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json.Serialization; // JSON döngüsel referans hatası için

var builder = WebApplication.CreateBuilder(args);

// --- 1. KULLANICI / DB AYARLARI ---
builder.Services.Configure<DatabaseSettings>(
    builder.Configuration.GetSection("DatabaseSettings"));

builder.Services.AddSingleton<IDatabaseSettings>(sp =>
    sp.GetRequiredService<Microsoft.Extensions.Options.IOptions<DatabaseSettings>>().Value);

// --- 2. DI Kayıtları (Repository ve Service) ---

// Kendi Repository'lerimizi ekliyoruz
builder.Services.AddSingleton<CategoryRepository>();
builder.Services.AddSingleton<UserRepository>();
builder.Services.AddSingleton<ProductRepository>();
// YENİ: Token oluşturma servisini DI'a ekliyoruz
builder.Services.AddSingleton<ITokenService, TokenService>();


// --- 3. JWT Kimlik Doğrulama Yapılandırması ---
var jwtSecret = builder.Configuration["JwtSettings:Secret"] ?? throw new ArgumentNullException("JWT Secret key appsettings.json dosyasında bulunamadı.");
var key = Encoding.ASCII.GetBytes(jwtSecret);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    // Geliştirme aşamasında HTTPS'e zorlamamak için
    options.RequireHttpsMetadata = false; 
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true, // Issuer (Dağıtıcı/Yayıncı) doğrulanmalı
        ValidateAudience = true, // Audience (Alıcı) doğrulanmalı
        ValidateLifetime = true, // Token ömrü doğrulanmalı
        ValidateIssuerSigningKey = true, // Gizli anahtar ile imza doğrulanmalı
        
        ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
        ValidAudience = builder.Configuration["JwtSettings:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(key)
    };
});
// --- JWT Yapılandırması Sonu ---


// --- 4. CONTROLLER VE SWAGGER YAPILANDIRMASI ---
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // JSON serileştirme sırasında döngüsel referansları (kategori içindeki ürün, ürün içindeki kategori gibi) ignore et.
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });

builder.Services.AddOpenApi(); // Muhtemelen Swagger (OpenAPI) için

var app = builder.Build();

// --- 5. HTTP PIPELINE YAPILANDIRMASI ---

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

// YENİ: JWT Kimlik Doğrulama (Authentication) middleware'ini ekliyoruz.
// Authorization'dan ÖNCE GELMELİDİR.
app.UseAuthentication(); 

// Mevcut yetkilendirme (Authorization) middleware'i
app.UseAuthorization();

app.MapControllers();

app.Run();