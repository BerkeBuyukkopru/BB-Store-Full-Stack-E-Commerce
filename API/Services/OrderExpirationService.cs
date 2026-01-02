using API.Repositories;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace API.Services
{
    public class OrderExpirationService : BackgroundService
    {
        private readonly OrderRepository _orderRepository;
        private readonly ILogger<OrderExpirationService> _logger;
        private readonly TimeSpan _checkInterval = TimeSpan.FromMinutes(1);
        private readonly TimeSpan _expirationThreshold = TimeSpan.FromMinutes(15);

        public OrderExpirationService(OrderRepository orderRepository, ILogger<OrderExpirationService> logger)
        {
            _orderRepository = orderRepository;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Order Expiration Service started.");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await CheckAndExpireOrders();
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error occurred while checking for expired orders.");
                }

                await Task.Delay(_checkInterval, stoppingToken);
            }
        }

        private async Task CheckAndExpireOrders()
        {
            var thresholdTime = DateTime.UtcNow.Subtract(_expirationThreshold);
            
            var expiredOrders = await _orderRepository.GetExpiredPendingOrdersAsync(thresholdTime);

            if (expiredOrders.Any())
            {
                _logger.LogInformation($"Found {expiredOrders.Count} expired pending orders. Cancelling them...");

                foreach (var order in expiredOrders)
                {
                    order.Status = "PaymentFailed";
                    await _orderRepository.UpdateAsync(order.Id!, order);
                    _logger.LogInformation($"Order {order.OrderNumber} marked as PaymentFailed.");
                }
            }
        }
    }
}
