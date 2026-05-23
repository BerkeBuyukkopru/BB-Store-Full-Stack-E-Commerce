using API.Models;
using API.Repositories;

namespace API.Services
{
    public class AdminSeedService
    {
        private readonly UserRepository _userRepository;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AdminSeedService> _logger;

        public AdminSeedService(
            UserRepository userRepository,
            IConfiguration configuration,
            ILogger<AdminSeedService> logger)
        {
            _userRepository = userRepository;
            _configuration = configuration;
            _logger = logger;
        }

        public async Task SeedAsync()
        {
            if (await _userRepository.CountAdminsAsync() > 0)
            {
                return;
            }

            var email = _configuration["AdminSeed:Email"];
            var password = _configuration["AdminSeed:Password"];

            if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
            {
                _logger.LogWarning("No admin user exists. Set AdminSeed:Email and AdminSeed:Password to create the first admin automatically.");
                return;
            }

            var existingUser = await _userRepository.GetByEmailAsync(email);
            if (existingUser != null)
            {
                existingUser.Password = BCrypt.Net.BCrypt.HashPassword(password);
                existingUser.Role = UserRole.admin;
                existingUser.UpdatedAt = DateTime.UtcNow;

                await _userRepository.UpdateAsync(existingUser.Id!, existingUser);
                _logger.LogInformation("Existing user {Email} was promoted to admin and its password was refreshed from AdminSeed configuration.", email);
                return;
            }

            var adminUser = new User
            {
                Name = _configuration["AdminSeed:Name"] ?? "Admin",
                Surname = _configuration["AdminSeed:Surname"] ?? "User",
                Email = email,
                Password = BCrypt.Net.BCrypt.HashPassword(password),
                Role = UserRole.admin,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _userRepository.CreateAsync(adminUser);
            _logger.LogInformation("Initial admin user {Email} was created.", email);
        }
    }
}
