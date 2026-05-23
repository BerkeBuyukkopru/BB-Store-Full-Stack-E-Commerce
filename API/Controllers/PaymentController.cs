using API.Dtos;
using API.Models;
using API.Repositories;
using Iyzipay;
using Iyzipay.Model;
using Iyzipay.Request;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System.Globalization;
using System.Security.Claims;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentController : ControllerBase
    {
        private readonly IyzicoPaymentOptions _options;
        private readonly OrderRepository _orderRepository;
        private readonly ProductRepository _productRepository;
        private readonly UserRepository _userRepository;
        private readonly CouponRepository _couponRepository;
        private readonly CargoCompanyRepository _cargoCompanyRepository;
        private readonly IConfiguration _configuration;

        public PaymentController(
            IOptions<IyzicoPaymentOptions> options,
            OrderRepository orderRepository,
            ProductRepository productRepository,
            UserRepository userRepository,
            CouponRepository couponRepository,
            CargoCompanyRepository cargoCompanyRepository,
            IConfiguration configuration)
        {
            _options = options.Value;
            _orderRepository = orderRepository;
            _productRepository = productRepository;
            _userRepository = userRepository;
            _couponRepository = couponRepository;
            _cargoCompanyRepository = cargoCompanyRepository;
            _configuration = configuration;
        }

        [HttpPost("checkout")]
        [Authorize]
        public async Task<IActionResult> Checkout([FromBody] PaymentRequestDto paymentRequest)
        {
            var validation = await BuildValidatedCheckoutAsync(paymentRequest);
            if (validation.Error != null)
            {
                return BadRequest(new { errorMessage = validation.Error });
            }

            var conversationId = Guid.NewGuid().ToString();
            var basketId = "B" + Guid.NewGuid().ToString("N")[..6];

            var newOrder = new Order
            {
                User = validation.User,
                BasketItems = validation.BasketItems,
                TotalPrice = validation.TotalPrice,
                ConversationId = conversationId,
                BasketId = basketId,
                Status = "Pending",
                Address = validation.Address,
                CargoFee = validation.CargoFee,
                CargoCompanyName = validation.CargoCompanyName
            };
            await _orderRepository.CreateAsync(newOrder);

            var request = new CreateCheckoutFormInitializeRequest
            {
                Locale = Locale.TR.ToString(),
                ConversationId = conversationId,
                Price = validation.TotalPrice.ToString(CultureInfo.InvariantCulture),
                PaidPrice = validation.TotalPrice.ToString(CultureInfo.InvariantCulture),
                Currency = Currency.TRY.ToString(),
                BasketId = basketId,
                PaymentGroup = PaymentGroup.PRODUCT.ToString(),
                CallbackUrl = GetCallbackUrl()
            };

            request.Buyer = BuildBuyer(validation.User!, validation.Address);
            var billingAddress = BuildBillingAddress(request.Buyer, validation.Address);
            request.BillingAddress = billingAddress;
            request.ShippingAddress = billingAddress;
            request.BasketItems = BuildIyzicoBasketItems(validation.BasketItems, validation.CargoFee);

            var actualResult = await CheckoutFormInitialize.Create(request, BuildOptions());

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
            var request = new RetrieveCheckoutFormRequest { Token = token };
            var checkoutForm = await CheckoutForm.Retrieve(request, BuildOptions());

            if (checkoutForm.Status == "success" && checkoutForm.PaymentStatus == "SUCCESS")
            {
                Order? order = null;

                if (!string.IsNullOrEmpty(checkoutForm.ConversationId))
                {
                    order = await _orderRepository.GetByConversationIdAsync(checkoutForm.ConversationId);
                }

                if (order == null && !string.IsNullOrEmpty(checkoutForm.BasketId))
                {
                    order = await _orderRepository.GetByBasketIdAsync(checkoutForm.BasketId);
                }

                if (order != null && order.Status != "PaymentSuccess")
                {
                    order.Status = "PaymentSuccess";
                    order.PaymentId = checkoutForm.PaymentId;
                    await _orderRepository.UpdateAsync(order.Id!, order);

                    await _productRepository.DecreaseStockAsync(order.BasketItems);
                }

                return Redirect(GetClientUrl("/payment/success"));
            }

            var friendlyErrorMessage = GetUserFriendlyErrorMessage(checkoutForm.ErrorCode, checkoutForm.ErrorMessage);
            return Redirect($"{GetClientUrl("/payment/failure")}?error={Uri.EscapeDataString(friendlyErrorMessage)}");
        }

        [HttpPost("process")]
        [Authorize]
        public async Task<IActionResult> ProcessPayment([FromBody] PaymentRequestDto paymentRequest)
        {
            var validation = await BuildValidatedCheckoutAsync(paymentRequest);
            if (validation.Error != null)
            {
                return BadRequest(new { errorMessage = validation.Error });
            }

            var request = new CreatePaymentRequest
            {
                Locale = Locale.TR.ToString(),
                ConversationId = Guid.NewGuid().ToString(),
                Price = validation.TotalPrice.ToString(CultureInfo.InvariantCulture),
                PaidPrice = validation.TotalPrice.ToString(CultureInfo.InvariantCulture),
                Currency = Currency.TRY.ToString(),
                Installment = 1,
                BasketId = "B" + Guid.NewGuid().ToString("N")[..6],
                PaymentChannel = PaymentChannel.WEB.ToString(),
                PaymentGroup = PaymentGroup.PRODUCT.ToString()
            };

            request.PaymentCard = new PaymentCard
            {
                CardHolderName = paymentRequest.CardHolderName,
                CardNumber = paymentRequest.CardNumber,
                ExpireMonth = paymentRequest.ExpireMonth,
                ExpireYear = paymentRequest.ExpireYear,
                Cvc = paymentRequest.Cvc,
                RegisterCard = paymentRequest.RegisterCard ? 1 : 0
            };

            request.Buyer = BuildBuyer(validation.User!, validation.Address);
            var billingAddress = BuildBillingAddress(request.Buyer, validation.Address);
            request.BillingAddress = billingAddress;
            request.ShippingAddress = billingAddress;
            request.BasketItems = BuildIyzicoBasketItems(validation.BasketItems, validation.CargoFee);

            var payment = await Payment.Create(request, BuildOptions());

            if (payment.Status == "failure")
            {
                return BadRequest(new { payment.ErrorMessage, payment.ErrorCode });
            }

            return Ok(new { payment.PaymentStatus, payment.BasketId, payment.ConversationId });
        }

        private async Task<CheckoutValidationResult> BuildValidatedCheckoutAsync(PaymentRequestDto paymentRequest)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrWhiteSpace(userId))
            {
                return CheckoutValidationResult.Fail("Oturum bulunamadi.");
            }

            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
            {
                return CheckoutValidationResult.Fail("Kullanici bulunamadi.");
            }

            if (paymentRequest.BasketItems.Count == 0)
            {
                return CheckoutValidationResult.Fail("Sepet bos.");
            }

            var address = ResolveUserAddress(user, paymentRequest.Address);
            if (address == null)
            {
                return CheckoutValidationResult.Fail("Gecerli bir teslimat adresi secin.");
            }

            var validatedItems = new List<BasketItemDto>();
            decimal subtotal = 0;

            foreach (var item in paymentRequest.BasketItems)
            {
                var product = await _productRepository.GetByIdAsync(item.Id);
                if (product == null)
                {
                    return CheckoutValidationResult.Fail("Sepette bulunamayan bir urun var.");
                }

                var productSize = product.Sizes.FirstOrDefault(s => s.Size == item.Size);
                if (item.Quantity <= 0 || productSize == null || productSize.Stock < item.Quantity)
                {
                    return CheckoutValidationResult.Fail($"{product.Name} icin yeterli stok yok.");
                }

                var unitPrice = CalculateFinalPrice(product.ProductPrice);
                subtotal += unitPrice * item.Quantity;

                validatedItems.Add(new BasketItemDto
                {
                    Id = product.Id!,
                    Name = product.Name,
                    Category = product.Category,
                    Price = unitPrice,
                    Quantity = item.Quantity,
                    Size = item.Size,
                    Color = item.Color,
                    Img = product.Img
                });
            }

            var discountAmount = await CalculateDiscountAsync(paymentRequest.CouponCode, subtotal);
            var cargoCompany = await ResolveCargoCompanyAsync(paymentRequest.CargoCompanyId);
            if (cargoCompany == null)
            {
                return CheckoutValidationResult.Fail("Gecerli bir kargo firmasi secin.");
            }

            var cargoFee = Math.Max(0, cargoCompany.Price);
            var totalPrice = subtotal - discountAmount + cargoFee;
            totalPrice = Math.Round(totalPrice, 2, MidpointRounding.AwayFromZero);

            if (totalPrice <= 0)
            {
                return CheckoutValidationResult.Fail("Odeme tutari gecersiz.");
            }

            return CheckoutValidationResult.Success(new UserDto
            {
                Id = user.Id,
                Name = user.Name,
                Surname = user.Surname,
                Email = user.Email,
                Role = user.Role,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt
            }, address, validatedItems, totalPrice, cargoFee, cargoCompany.CompanyName);
        }

        private async Task<CargoCompany?> ResolveCargoCompanyAsync(Guid? cargoCompanyId)
        {
            if (cargoCompanyId == null || cargoCompanyId == Guid.Empty)
            {
                return null;
            }

            return await _cargoCompanyRepository.GetByIdAsync(cargoCompanyId.Value);
        }

        private async Task<decimal> CalculateDiscountAsync(string couponCode, decimal subtotal)
        {
            if (string.IsNullOrWhiteSpace(couponCode))
            {
                return 0;
            }

            var coupon = await _couponRepository.GetByCodeAsync(couponCode);
            if (coupon == null || coupon.DiscountPercent <= 0)
            {
                return 0;
            }

            return Math.Round(subtotal * coupon.DiscountPercent / 100, 2, MidpointRounding.AwayFromZero);
        }

        private API.Models.Address? ResolveUserAddress(User user, API.Models.Address? requestedAddress)
        {
            var addresses = user.Addresses ?? new List<API.Models.Address>();

            if (requestedAddress != null && requestedAddress.Id != Guid.Empty)
            {
                return addresses.FirstOrDefault(a => a.Id == requestedAddress.Id);
            }

            return addresses.FirstOrDefault();
        }

        private decimal CalculateFinalPrice(Price price)
        {
            var discount = price.Discount.GetValueOrDefault();
            if (discount <= 0)
            {
                return price.Current;
            }

            return Math.Round(price.Current - (price.Current * discount / 100), 2, MidpointRounding.AwayFromZero);
        }

        private Buyer BuildBuyer(UserDto user, API.Models.Address? address)
        {
            return new Buyer
            {
                Id = user.Id ?? "0",
                Name = user.Name,
                Surname = user.Surname,
                GsmNumber = address?.Phone ?? "+905350000000",
                Email = user.Email,
                IdentityNumber = "74300864791",
                LastLoginDate = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture),
                RegistrationDate = user.CreatedAt.ToString("yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture),
                RegistrationAddress = address?.AddressDetail ?? "Istanbul",
                Ip = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "127.0.0.1",
                City = address?.City ?? "Istanbul",
                Country = "Turkey",
                ZipCode = "34000"
            };
        }

        private Iyzipay.Model.Address BuildBillingAddress(Buyer buyer, API.Models.Address? address)
        {
            return new Iyzipay.Model.Address
            {
                ContactName = buyer.Name + " " + buyer.Surname,
                City = address?.City ?? "Istanbul",
                Country = "Turkey",
                Description = address?.AddressDetail ?? "Istanbul",
                ZipCode = "34000"
            };
        }

        private List<BasketItem> BuildIyzicoBasketItems(List<BasketItemDto> basketItems, decimal cargoFee)
        {
            var iyzicoItems = basketItems.Select(item => new BasketItem
            {
                Id = item.Id,
                Name = item.Name,
                Category1 = item.Category,
                ItemType = BasketItemType.PHYSICAL.ToString(),
                Price = (item.Price * item.Quantity).ToString(CultureInfo.InvariantCulture)
            }).ToList();

            if (cargoFee > 0)
            {
                iyzicoItems.Add(new BasketItem
                {
                    Id = "Cargo",
                    Name = "Kargo Ucreti",
                    Category1 = "Kargo",
                    ItemType = BasketItemType.PHYSICAL.ToString(),
                    Price = cargoFee.ToString(CultureInfo.InvariantCulture)
                });
            }

            return iyzicoItems;
        }

        private Iyzipay.Options BuildOptions()
        {
            return new Iyzipay.Options
            {
                ApiKey = _options.ApiKey,
                SecretKey = _options.SecretKey,
                BaseUrl = _options.BaseUrl
            };
        }

        private string GetCallbackUrl()
        {
            return _configuration["IyzicoSettings:CallbackUrl"]
                ?? $"{Request.Scheme}://{Request.Host}/api/payment/callback";
        }

        private string GetClientUrl(string path)
        {
            var baseUrl = _configuration["ClientSettings:BaseUrl"]?.TrimEnd('/') ?? "http://localhost:5173";
            return $"{baseUrl}{path}";
        }

        private string GetUserFriendlyErrorMessage(string errorCode, string errorMessage)
        {
            return errorCode switch
            {
                "10051" => "Kart limitiniz yetersiz.",
                "10005" => "Islem banka tarafindan onaylanmadi.",
                "10057" => "Kartiniz e-ticaret islemlerine kapali olabilir.",
                "10058" => "Kartinizin son kullanma tarihi dolmus.",
                "10012" => "Gecersiz islem.",
                "10093" => "Kartinizin limiti yetersiz.",
                _ => !string.IsNullOrEmpty(errorMessage) ? errorMessage : "Odeme islemi basarisiz oldu."
            };
        }

        private class CheckoutValidationResult
        {
            public string? Error { get; private init; }
            public UserDto? User { get; private init; }
            public API.Models.Address? Address { get; private init; }
            public List<BasketItemDto> BasketItems { get; private init; } = new();
            public decimal TotalPrice { get; private init; }
            public decimal CargoFee { get; private init; }
            public string CargoCompanyName { get; private init; } = string.Empty;

            public static CheckoutValidationResult Fail(string error) => new() { Error = error };

            public static CheckoutValidationResult Success(
                UserDto user,
                API.Models.Address address,
                List<BasketItemDto> basketItems,
                decimal totalPrice,
                decimal cargoFee,
                string cargoCompanyName)
            {
                return new CheckoutValidationResult
                {
                    User = user,
                    Address = address,
                    BasketItems = basketItems,
                    TotalPrice = totalPrice,
                    CargoFee = cargoFee,
                    CargoCompanyName = cargoCompanyName
                };
            }
        }
    }
}
