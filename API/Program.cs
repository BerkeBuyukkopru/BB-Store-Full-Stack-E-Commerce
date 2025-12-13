using API.Models;
using API.Repositories;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<DatabaseSettings>(
    builder.Configuration.GetSection("DatabaseSettings"));

builder.Services.AddSingleton<IDatabaseSettings>(sp =>
    sp.GetRequiredService<Microsoft.Extensions.Options.IOptions<DatabaseSettings>>().Value);

builder.Services.AddControllers();

builder.Services.AddSingleton<CategoryRepository>();
builder.Services.AddSingleton<UserRepository>();

builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
