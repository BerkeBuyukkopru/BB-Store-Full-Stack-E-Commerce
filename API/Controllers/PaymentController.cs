using System;
using System.Collections.Generic;
using API.Dtos;
using API.Models;
using Iyzipay;
using Iyzipay.Model;
using Iyzipay.Request;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System.Globalization;
using System.Threading.Tasks;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentController : ControllerBase
    {
        private readonly IyzicoPaymentOptions _options;
        private readonly API.Repositories.OrderRepository _orderRepository;
        private readonly API.Repositories.ProductRepository _productRepository;

        public PaymentController(IOptions<IyzicoPaymentOptions> options, API.Repositories.OrderRepository orderRepository, API.Repositories.ProductRepository productRepository)
        {
            _options = options.Value;
            _orderRepository = orderRepository;
            _productRepository = productRepository;
        }

        [HttpPost("checkout")]
        public async Task<IActionResult> Checkout([FromBody] PaymentRequestDto paymentRequest)
        {
            var conversationId = Guid.NewGuid().ToString();
            var basketId = "B" + Guid.NewGuid().ToString().Substring(0, 6);

            // 1. Create Pending Order
            var newOrder = new API.Models.Order
            {
                User = paymentRequest.User,
                BasketItems = paymentRequest.BasketItems,
                TotalPrice = paymentRequest.TotalPrice,
                ConversationId = conversationId,
                BasketId = basketId,
                Status = "Pending",
                Address = paymentRequest.Address,
                CargoFee = paymentRequest.CargoFee // Save CargoFee separately
            };
            await _orderRepository.CreateAsync(newOrder);


            var options = new Iyzipay.Options
            {
                ApiKey = _options.ApiKey,
                SecretKey = _options.SecretKey,
                BaseUrl = _options.BaseUrl
            };

            var request = new Iyzipay.Request.CreateCheckoutFormInitializeRequest
            {
                Locale = Iyzipay.Model.Locale.TR.ToString(),
                ConversationId = conversationId,
                Price = paymentRequest.TotalPrice.ToString(new CultureInfo("en-US")),
                PaidPrice = paymentRequest.TotalPrice.ToString(new CultureInfo("en-US")),
                Currency = Iyzipay.Model.Currency.TRY.ToString(),
                BasketId = basketId,
                PaymentGroup = Iyzipay.Model.PaymentGroup.PRODUCT.ToString(),
                CallbackUrl = "http://localhost:5020/api/payment/callback"
            };

            // ... buyer and address setup ...
            
            var buyer = new Iyzipay.Model.Buyer
            {
                Id = paymentRequest.User?.Id ?? "0",
                Name = paymentRequest.User?.Name ?? "John",
                Surname = paymentRequest.User?.Surname ?? "Doe",
                GsmNumber = paymentRequest.Address?.Phone ?? "+905350000000",
                Email = paymentRequest.User?.Email ?? "email@email.com",
                IdentityNumber = "74300864791",
                LastLoginDate = "2015-10-05 12:43:35",
                RegistrationDate = "2013-04-21 15:12:09",
                RegistrationAddress = paymentRequest.Address?.AddressDetail ?? "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
                Ip = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "85.34.78.112",
                City = paymentRequest.Address?.City ?? "Istanbul",
                Country = "Turkey",
                ZipCode = "34732"
            };
            request.Buyer = buyer;

            var billingAddress = new Iyzipay.Model.Address
            {
                ContactName = buyer.Name + " " + buyer.Surname,
                City = paymentRequest.Address?.City ?? "Istanbul",
                Country = "Turkey",
                Description = paymentRequest.Address?.AddressDetail ?? "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
                ZipCode = "34742"
            };
            request.BillingAddress = billingAddress;
            request.ShippingAddress = billingAddress;

            var basketItems = new List<Iyzipay.Model.BasketItem>();

            foreach (var item in paymentRequest.BasketItems)
            {
                var basketItem = new Iyzipay.Model.BasketItem
                {
                    Id = item.Id,
                    Name = item.Name,
                    Category1 = item.Category,
                    ItemType = Iyzipay.Model.BasketItemType.PHYSICAL.ToString(),
                    Price = (item.Price * item.Quantity).ToString(new CultureInfo("en-US"))
                };
                basketItems.Add(basketItem);
            }

            // Add Cargo Fee as a separate item for Iyzico (if exists)
            if (paymentRequest.CargoFee > 0)
            {
                var cargoItem = new Iyzipay.Model.BasketItem
                {
                    Id = "Cargo",
                    Name = "Kargo Ücreti",
                    Category1 = "Kargo",
                    ItemType = Iyzipay.Model.BasketItemType.PHYSICAL.ToString(),
                    Price = paymentRequest.CargoFee.ToString(new CultureInfo("en-US"))
                };
                basketItems.Add(cargoItem);
            }

            request.BasketItems = basketItems;

            var actualResult = await Iyzipay.Model.CheckoutFormInitialize.Create(request, options);

            if (actualResult.Status == "failure")
            {
                return BadRequest(new { actualResult.ErrorMessage, actualResult.ErrorCode });
            }

            return Ok(new { Content = actualResult.CheckoutFormContent });
        }

        [HttpPost("callback")]
        public async Task<IActionResult> Callback([FromForm] IFormCollection form)
        {
            var token = form["token"];
            
            var options = new Iyzipay.Options
            {
                ApiKey = _options.ApiKey,
                SecretKey = _options.SecretKey,
                BaseUrl = _options.BaseUrl
            };

            var request = new RetrieveCheckoutFormRequest { Token = token };
            var checkoutForm = await Iyzipay.Model.CheckoutForm.Retrieve(request, options);

            if (checkoutForm.Status == "success" && checkoutForm.PaymentStatus == "SUCCESS")
            {
                // Payment Successful
                API.Models.Order? order = null;
                
                if (!string.IsNullOrEmpty(checkoutForm.ConversationId))
                {
                    order = await _orderRepository.GetByConversationIdAsync(checkoutForm.ConversationId);
                }

                if (order == null && !string.IsNullOrEmpty(checkoutForm.BasketId))
                {
                     order = await _orderRepository.GetByBasketIdAsync(checkoutForm.BasketId);
                }

                if (order != null)
                {
                    order.Status = "PaymentSuccess";
                    order.PaymentId = checkoutForm.PaymentId;
                    await _orderRepository.UpdateAsync(order.Id!, order);
                    
                    // Decrease Stock
                    await _productRepository.DecreaseStockAsync(order.BasketItems);
                }

                return Redirect("http://localhost:5173/payment/success");
            }
            else
            {
                // Payment Failed
                var errorMessage = checkoutForm.ErrorMessage ?? "Ödeme işlemi başarısız.";
                return Redirect($"http://localhost:5173/payment/failure?error={errorMessage}");
            }
        }
        [HttpPost("process")]
        public async Task<IActionResult> ProcessPayment([FromBody] PaymentRequestDto paymentRequest)
        {
            var options = new Iyzipay.Options
            {
                ApiKey = _options.ApiKey,
                SecretKey = _options.SecretKey,
                BaseUrl = _options.BaseUrl
            };

            var request = new Iyzipay.Request.CreatePaymentRequest
            {
                Locale = Iyzipay.Model.Locale.TR.ToString(),
                ConversationId = Guid.NewGuid().ToString(),
                Price = paymentRequest.TotalPrice.ToString(new CultureInfo("en-US")),
                PaidPrice = paymentRequest.TotalPrice.ToString(new CultureInfo("en-US")),
                Currency = Iyzipay.Model.Currency.TRY.ToString(),
                Installment = 1,
                BasketId = "B" + Guid.NewGuid().ToString().Substring(0, 6),
                PaymentChannel = Iyzipay.Model.PaymentChannel.WEB.ToString(),
                PaymentGroup = Iyzipay.Model.PaymentGroup.PRODUCT.ToString()
            };

            var paymentCard = new Iyzipay.Model.PaymentCard
            {
                CardHolderName = paymentRequest.CardHolderName,
                CardNumber = paymentRequest.CardNumber,
                ExpireMonth = paymentRequest.ExpireMonth,
                ExpireYear = paymentRequest.ExpireYear,
                Cvc = paymentRequest.Cvc,
                RegisterCard = paymentRequest.RegisterCard ? 1 : 0
            };
            request.PaymentCard = paymentCard;

            var buyer = new Iyzipay.Model.Buyer
            {
                Id = paymentRequest.User?.Id ?? "0",
                Name = paymentRequest.User?.Name ?? "John",
                Surname = "Doe",
                GsmNumber = "+905350000000",
                Email = paymentRequest.User?.Email ?? "email@email.com",
                IdentityNumber = "74300864791",
                LastLoginDate = "2015-10-05 12:43:35",
                RegistrationDate = "2013-04-21 15:12:09",
                RegistrationAddress = "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
                Ip = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "85.34.78.112",
                City = "Istanbul",
                Country = "Turkey",
                ZipCode = "34732"
            };
            request.Buyer = buyer;

            var billingAddress = new Iyzipay.Model.Address
            {
                ContactName = buyer.Name + " " + buyer.Surname,
                City = "Istanbul",
                Country = "Turkey",
                Description = "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
                ZipCode = "34742"
            };
            request.BillingAddress = billingAddress;
            request.ShippingAddress = billingAddress;

            var basketItems = new List<Iyzipay.Model.BasketItem>();

            foreach (var item in paymentRequest.BasketItems)
            {
                var basketItem = new Iyzipay.Model.BasketItem
                {
                    Id = item.Id,
                    Name = item.Name,
                    Category1 = item.Category,
                    ItemType = Iyzipay.Model.BasketItemType.PHYSICAL.ToString(),
                    Price = (item.Price * item.Quantity).ToString(new CultureInfo("en-US"))
                };
                basketItems.Add(basketItem);
            }

            // Add Cargo Fee as a separate item for Iyzico (if exists)
            if (paymentRequest.CargoFee > 0)
            {
                var cargoItem = new Iyzipay.Model.BasketItem
                {
                    Id = "Cargo",
                    Name = "Kargo Ücreti",
                    Category1 = "Kargo",
                    ItemType = Iyzipay.Model.BasketItemType.PHYSICAL.ToString(),
                    Price = paymentRequest.CargoFee.ToString(new CultureInfo("en-US"))
                };
                basketItems.Add(cargoItem);
            }

            request.BasketItems = basketItems;

            var payment = await Iyzipay.Model.Payment.Create(request, options);

            if (payment.Status == "failure")
            {
                return BadRequest(new { payment.ErrorMessage, payment.ErrorCode });
            }

            return Ok(new { payment.PaymentStatus, payment.BasketId, payment.ConversationId });
        }
    }
}
