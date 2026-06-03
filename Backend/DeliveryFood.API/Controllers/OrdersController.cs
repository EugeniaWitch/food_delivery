using DeliveryFood.API.Data;
using DeliveryFood.API.DTOs;
using DeliveryFood.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace DeliveryFood.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _db;

        public OrdersController(AppDbContext db)
        {
            _db = db;
        }

        // Создать заказ (нажатие кнопки Оплатить)
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDto dto)
        {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var total = dto.Items.Sum(i => i.Price * i.Quantity);
        var orderItems = dto.Items.Select(i => new OrderItem
        {
            MenuItemId = i.MenuItemId,
            Quantity = i.Quantity,
            Price = i.Price
        }).ToList();

        // Применяем промокод
        if (!string.IsNullOrEmpty(dto.PromoCode))
        {
            var promo = await _db.Promos
                .FirstOrDefaultAsync(p => p.Code.ToLower() == dto.PromoCode.ToLower() && p.IsActive);

            if (promo != null && promo.ExpiresAt >= DateTime.UtcNow)
            {
                var alreadyUsed = await _db.UsedPromos
                    .AnyAsync(u => u.UserId == userId && u.PromoId == promo.Id);

                if (!alreadyUsed && total >= promo.MinOrderAmount)
                {
                    total = total - Math.Round(total * promo.DiscountPercent / 100, 2);
                    _db.UsedPromos.Add(new UsedPromo { UserId = userId, PromoId = promo.Id });
                }
            }
        }

        // Проверяем акции ресторана и добавляем подарки
        // Проверяем акции ресторана и добавляем подарки
    // Проверяем акции ресторана и добавляем подарки
    var originalTotal = dto.Items.Sum(i => i.Price * i.Quantity);
    var restaurantPromos = await _db.RestaurantPromos
        .Where(p => p.RestaurantId == dto.RestaurantId && p.IsActive)
        .ToListAsync();

    foreach (var rPromo in restaurantPromos)
    {
        // Акция "Бесплатный товар от суммы"
        if (rPromo.Type == RestaurantPromoType.FreeItemOnSum &&
            originalTotal >= rPromo.MinOrderAmount &&
            rPromo.FreeMenuItemId.HasValue)
        {
            var freeItem = await _db.MenuItems.FindAsync(rPromo.FreeMenuItemId.Value);
            if (freeItem != null)
            {
                var alreadyAdded = orderItems.Any(i => i.MenuItemId == freeItem.Id && i.Price == 0);
                if (!alreadyAdded)
                {
                    orderItems.Add(new OrderItem
                    {
                        MenuItemId = freeItem.Id,
                        Quantity = 1,
                        Price = 0
                    });
                }
            }
        }

        // Акция "Купи N получи M"
        if (rPromo.Type == RestaurantPromoType.BuyNGetM &&
            rPromo.BuyQuantity.HasValue &&
            rPromo.GetQuantity.HasValue)
        {
            // Ищем конкретное блюдо если указано, иначе берём первое подходящее
            var targetItems = rPromo.TargetMenuItemId.HasValue
                ? dto.Items.Where(i => i.MenuItemId == rPromo.TargetMenuItemId.Value).ToList()
                : dto.Items.ToList();

            foreach (var orderItem in targetItems)
            {
                if (orderItem.Quantity >= rPromo.BuyQuantity.Value)
                {
                    var freeQuantity = (orderItem.Quantity / rPromo.BuyQuantity.Value) * rPromo.GetQuantity.Value;
                    var alreadyAdded = orderItems.Any(i => i.MenuItemId == orderItem.MenuItemId && i.Price == 0);
                    if (!alreadyAdded && freeQuantity > 0)
                    {
                        orderItems.Add(new OrderItem
                        {
                            MenuItemId = orderItem.MenuItemId,
                            Quantity = freeQuantity,
                            Price = 0
                        });
                    }
                }
            }
        }
    }

        var order = new Order
        {
            UserId = userId,
            RestaurantId = dto.RestaurantId,
            DeliveryAddress = dto.DeliveryAddress,
            TotalPrice = total,
            OrderItems = orderItems
        };

        _db.Orders.Add(order);
        await _db.SaveChangesAsync();

        return Ok(new { message = "Заказ успешно оформлен!", orderId = order.Id });
    }

        // История заказов пользователя
        [HttpGet("my")]
        public async Task<IActionResult> GetMyOrders()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var orders = await _db.Orders
                .Where(o => o.UserId == userId)
                .Include(o => o.Restaurant)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.MenuItem)
                .OrderByDescending(o => o.CreatedAt)
                .Select(o => new OrderResponseDto
                {
                    Id = o.Id,
                    CreatedAt = o.CreatedAt,
                    TotalPrice = o.TotalPrice,
                    Status = o.Status,
                    DeliveryAddress = o.DeliveryAddress,
                    RestaurantName = o.Restaurant.Name,
                    Items = o.OrderItems.Select(oi => new OrderItemResponseDto
                    {
                        MenuItemName = oi.MenuItem.Name,
                        Quantity = oi.Quantity,
                        Price = oi.Price
                    }).ToList()
                })
                .ToListAsync();

            return Ok(orders);
        }
    }
}