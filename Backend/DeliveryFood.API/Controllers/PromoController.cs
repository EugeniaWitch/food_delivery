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
    public class PromoController : ControllerBase
    {
        private readonly AppDbContext _db;

        public PromoController(AppDbContext db)
        {
            _db = db;
        }

        // Проверить и применить промокод
        [HttpPost("apply")]
        [Authorize]
        public async Task<IActionResult> Apply([FromBody] ApplyPromoDto dto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var promo = await _db.Promos
                .FirstOrDefaultAsync(p => p.Code.ToLower() == dto.Code.ToLower() && p.IsActive);

            if (promo == null)
                return BadRequest(new { message = "Промокод не найден или неактивен" });

            if (promo.ExpiresAt < DateTime.UtcNow)
                return BadRequest(new { message = "Срок действия промокода истёк" });

            if (dto.OrderTotal < promo.MinOrderAmount)
                return BadRequest(new { message = $"Минимальная сумма заказа для этого промокода: {promo.MinOrderAmount} ₽" });

            // Проверяем не использовал ли уже
            var alreadyUsed = await _db.UsedPromos
                .AnyAsync(u => u.UserId == userId && u.PromoId == promo.Id);

            if (alreadyUsed)
                return BadRequest(new { message = "Вы уже использовали этот промокод" });

            var discountAmount = Math.Round(dto.OrderTotal * promo.DiscountPercent / 100, 2);
            var newTotal = dto.OrderTotal - discountAmount;

            return Ok(new PromoResponseDto
            {
                PromoId = promo.Id,
                Description = promo.Description,
                DiscountPercent = promo.DiscountPercent,
                DiscountAmount = discountAmount,
                NewTotal = newTotal
            });
        }

        // Получить акции ресторана
        [HttpGet("restaurant/{restaurantId}")]
        public async Task<IActionResult> GetRestaurantPromos(int restaurantId)
        {
            var promos = await _db.RestaurantPromos
                .Where(p => p.RestaurantId == restaurantId && p.IsActive)
                .Select(p => new
                {
                    p.Id,
                    p.Title,
                    p.Description,
                    p.Type,
                    p.MinOrderAmount,
                    p.BuyQuantity,
                    p.GetQuantity,
                    p.FreeMenuItemId
                })
                .ToListAsync();

            return Ok(promos);
        }
    }
}