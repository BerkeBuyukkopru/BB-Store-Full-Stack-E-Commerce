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

builder.Services.Configure<IyzicoPaymentOptions>(
    builder.Configuration.GetSection("IyzicoSettings"));

builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy",
        builder => builder
        .WithOrigins("http://localhost:5173") 
        .AllowAnyMethod() // GET, POST, PUT, DELETE gibi tüm metodlara izin ver
        .AllowAnyHeader() // Tüm başlık tiplerine izin ver
        .AllowCredentials()); // Eğer HTTP-Only Cookie kullanılıyorsa KRİTİKTİR!
});

// --- 3. DI Kayıtları (Repository ve Service) ---

builder.Services.AddSingleton<CategoryRepository>();
builder.Services.AddSingleton<UserRepository>();
builder.Services.AddSingleton<ProductRepository>();
builder.Services.AddSingleton<CouponRepository>();
builder.Services.AddSingleton<OrderRepository>();
builder.Services.AddSingleton<SiteSettingRepository>();
builder.Services.AddSingleton<SliderRepository>();
builder.Services.AddSingleton<BlogRepository>();
builder.Services.AddSingleton<ContactRepository>();
builder.Services.AddSingleton<CargoCompanyRepository>();

// Background Services
builder.Services.AddHostedService<OrderExpirationService>();

// Token oluşturma servisi
builder.Services.AddSingleton<ITokenService, TokenService>();


// --- 4. JWT Kimlik Doğrulama Yapılandırması ---
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
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            // İsteğin Cookie'sini kontrol et
            context.Token = context.Request.Cookies["AuthToken"];

            // Token bulunduysa Context'e set edilir
            if (context.Token == null)
            {
                // Eğer cookie'de token yoksa, standart başlıkta aranır (yedek olarak)
                return Task.CompletedTask;
            }
            return Task.CompletedTask;
        }
    };
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


// --- 5. CONTROLLER VE SWAGGER YAPILANDIRMASI ---
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // JSON serileştirme sırasında döngüsel referansları (kategori içindeki ürün, ürün içindeki kategori gibi) ignore et.
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });

builder.Services.AddOpenApi(); // Muhtemelen Swagger (OpenAPI) için

var app = builder.Build();

// --- 6. HTTP PIPELINE YAPILANDIRMASI ---

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

// **********************************************
// YENİ EKLENEN KISIM: CORS MIDDLEWARE'i
// CORS, UseAuthentication'dan ÖNCE GELMELİDİR.
// **********************************************
app.UseCors("CorsPolicy"); 

// YENİ: JWT Kimlik Doğrulama (Authentication) middleware'ini ekliyoruz.
// Authorization'dan ÖNCE GELMELİDİR.
app.UseAuthentication(); 

// Mevcut yetkilendirme (Authorization) middleware'i
app.UseAuthorization();

app.MapControllers();

// --- MIGRATION: Fix Legacy Data ---
using (var scope = app.Services.CreateScope())
{
    var productRepo = scope.ServiceProvider.GetRequiredService<ProductRepository>();
    // Call the migration - this is safe to run on every startup as it checks for String type
    productRepo.MigrateLegacySizesAsync().GetAwaiter().GetResult();
}

app.Run();