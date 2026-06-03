using DeliveryFood.API.Data;
using DeliveryFood.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace DeliveryFood.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "admin")]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _db;

        public AdminController(AppDbContext db)
        {
            _db = db;
        }

        // ===== СТАТИСТИКА =====
        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var totalOrders = await _db.Orders.CountAsync();
            var totalRevenue = await _db.Orders.SumAsync(o => o.TotalPrice);
            var totalUsers = await _db.Users.CountAsync(u => u.Role == "user");
            var totalRestaurants = await _db.Restaurants.CountAsync();

            var ordersByRestaurant = await _db.Orders
                .Include(o => o.Restaurant)
                .GroupBy(o => o.Restaurant.Name)
                .Select(g => new {
                    restaurant = g.Key,
                    orders = g.Count(),
                    revenue = g.Sum(o => o.TotalPrice)
                })
                .OrderByDescending(x => x.orders)
                .ToListAsync();

            var recentOrders = await _db.Orders
                .Include(o => o.User)
                .Include(o => o.Restaurant)
                .OrderByDescending(o => o.CreatedAt)
                .Take(10)
                .Select(o => new {
                    o.Id,
                    o.CreatedAt,
                    o.TotalPrice,
                    o.Status,
                    UserEmail = o.User.Email,
                    RestaurantName = o.Restaurant.Name
                })
                .ToListAsync();

            return Ok(new {
                totalOrders,
                totalRevenue,
                totalUsers,
                totalRestaurants,
                ordersByRestaurant,
                recentOrders
            });
        }

        // ===== РЕСТОРАНЫ =====
        [HttpGet("restaurants")]
        public async Task<IActionResult> GetRestaurants()
        {
            var restaurants = await _db.Restaurants
                .Select(r => new {
                    r.Id,
                    r.Name,
                    r.ImageUrl,
                    r.Rating,
                    r.DeliveryTimeMin,
                    r.DeliveryTimeMax,
                    r.Cuisine,
                    r.Category,
                    r.HasPromo
                })
                .ToListAsync();
            return Ok(restaurants);
        }

        [HttpPost("restaurants")]
        public async Task<IActionResult> CreateRestaurant([FromBody] JsonElement body)
        {
            var restaurant = new Restaurant
            {
                Name = body.TryGetProperty("name", out var n) ? n.GetString()! : string.Empty,
                ImageUrl = body.TryGetProperty("imageUrl", out var img) && !string.IsNullOrEmpty(img.GetString())
                    ? img.GetString()!
                    : "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400",
                Rating = body.TryGetProperty("rating", out var r) ? r.GetDouble() : 4.0,
                DeliveryTimeMin = body.TryGetProperty("deliveryTimeMin", out var min) ? min.GetInt32() : 20,
                DeliveryTimeMax = body.TryGetProperty("deliveryTimeMax", out var max) ? max.GetInt32() : 40,
                Cuisine = body.TryGetProperty("cuisine", out var c) ? c.GetString()! : string.Empty,
                Category = body.TryGetProperty("category", out var cat) ? cat.GetString()! : string.Empty,
                Category2 = body.TryGetProperty("category2", out var c2) && c2.ValueKind != JsonValueKind.Null ? c2.GetString() : null,
                Category3 = body.TryGetProperty("category3", out var c3) && c3.ValueKind != JsonValueKind.Null ? c3.GetString() : null,
                HasPromo = body.TryGetProperty("hasPromo", out var promo) && promo.GetBoolean(),
                MenuItems = new List<MenuItem>()
            };

            _db.Restaurants.Add(restaurant);
            await _db.SaveChangesAsync();
            return Ok(restaurant);
        }

        [HttpDelete("restaurants/{id}")]
        public async Task<IActionResult> DeleteRestaurant(int id)
        {
            var restaurant = await _db.Restaurants.FindAsync(id);
            if (restaurant == null) return NotFound();
            _db.Restaurants.Remove(restaurant);
            await _db.SaveChangesAsync();
            return Ok(new { message = "Ресторан удалён" });
        }

        // ===== МЕНЮ =====
        [HttpGet("restaurants/{restaurantId}/menu")]
        public async Task<IActionResult> GetMenu(int restaurantId)
        {
            var items = await _db.MenuItems
                .Where(m => m.RestaurantId == restaurantId)
                .ToListAsync();
            return Ok(items);
        }

        [HttpGet("menu/{id}")]
        public async Task<IActionResult> GetMenuItem(int id)
        {
            var item = await _db.MenuItems.FindAsync(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        [HttpPost("restaurants/{restaurantId}/menu")]
        public async Task<IActionResult> CreateMenuItem(int restaurantId, [FromBody] JsonElement body)
        {
            var restaurant = await _db.Restaurants.FindAsync(restaurantId);
            if (restaurant == null) return NotFound(new { message = "Ресторан не найден" });

            var menuItem = new MenuItem
            {
                Name = body.TryGetProperty("name", out var n) ? n.GetString()! : string.Empty,
                Description = body.TryGetProperty("description", out var d) ? d.GetString()! : string.Empty,
                Price = body.TryGetProperty("price", out var p) ? (decimal)p.GetDouble() : 0,
                ImageUrl = body.TryGetProperty("imageUrl", out var img) && !string.IsNullOrEmpty(img.GetString())
                    ? img.GetString()!
                    : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300",
                Category = body.TryGetProperty("category", out var cat) ? cat.GetString()! : string.Empty,
                IsAvailable = true,
                RestaurantId = restaurantId
            };

            _db.MenuItems.Add(menuItem);
            await _db.SaveChangesAsync();
            return Ok(menuItem);
        }

        [HttpPut("menu/{id}")]
        public async Task<IActionResult> UpdateMenuItem(int id, [FromBody] JsonElement body)
        {
            var item = await _db.MenuItems.FindAsync(id);
            if (item == null) return NotFound();

            if (body.TryGetProperty("name", out var name)) item.Name = name.GetString()!;
            if (body.TryGetProperty("description", out var desc)) item.Description = desc.GetString()!;
            if (body.TryGetProperty("price", out var price)) item.Price = (decimal)price.GetDouble();
            if (body.TryGetProperty("imageUrl", out var img)) item.ImageUrl = img.GetString()!;
            if (body.TryGetProperty("category", out var cat)) item.Category = cat.GetString()!;
            if (body.TryGetProperty("isAvailable", out var avail)) item.IsAvailable = avail.GetBoolean();

            await _db.SaveChangesAsync();
            return Ok(item);
        }

        [HttpDelete("menu/{id}")]
        public async Task<IActionResult> DeleteMenuItem(int id)
        {
            var item = await _db.MenuItems.FindAsync(id);
            if (item == null) return NotFound();
            _db.MenuItems.Remove(item);
            await _db.SaveChangesAsync();
            return Ok(new { message = "Блюдо удалено" });
        }

        [HttpPut("restaurants/{id}")]
        public async Task<IActionResult> UpdateRestaurant(int id, [FromBody] JsonElement body)
        {
            var restaurant = await _db.Restaurants.FindAsync(id);
            if (restaurant == null) return NotFound();

            if (body.TryGetProperty("name", out var name)) restaurant.Name = name.GetString()!;
            if (body.TryGetProperty("imageUrl", out var imageUrl)) restaurant.ImageUrl = imageUrl.GetString()!;
            if (body.TryGetProperty("rating", out var rating)) restaurant.Rating = rating.GetDouble();
            if (body.TryGetProperty("deliveryTimeMin", out var min)) restaurant.DeliveryTimeMin = min.GetInt32();
            if (body.TryGetProperty("deliveryTimeMax", out var max)) restaurant.DeliveryTimeMax = max.GetInt32();
            if (body.TryGetProperty("cuisine", out var cuisine)) restaurant.Cuisine = cuisine.GetString()!;
            if (body.TryGetProperty("category", out var category)) restaurant.Category = category.GetString()!;
            if (body.TryGetProperty("category2", out var cat2)) restaurant.Category2 = cat2.ValueKind != JsonValueKind.Null ? cat2.GetString() : null;
            if (body.TryGetProperty("category3", out var cat3)) restaurant.Category3 = cat3.ValueKind != JsonValueKind.Null ? cat3.GetString() : null;
            if (body.TryGetProperty("hasPromo", out var hasPromo)) restaurant.HasPromo = hasPromo.GetBoolean();

            await _db.SaveChangesAsync();
            return Ok(restaurant);
        }



        // ===== ПРОМОКОДЫ =====
        [HttpGet("promos")]
        public async Task<IActionResult> GetPromos()
        {
            var promos = await _db.Promos
                .Include(p => p.UsedPromos)
                .Select(p => new {
                    p.Id,
                    p.Code,
                    p.Description,
                    p.DiscountPercent,
                    p.MinOrderAmount,
                    p.ExpiresAt,
                    p.IsActive,
                    UsedCount = p.UsedPromos.Count
                })
                .ToListAsync();
            return Ok(promos);
        }

        [HttpPost("promos")]
        public async Task<IActionResult> CreatePromo([FromBody] Promo promo)
        {
            _db.Promos.Add(promo);
            await _db.SaveChangesAsync();
            return Ok(promo);
        }

        [HttpPut("promos/{id}/toggle")]
        public async Task<IActionResult> TogglePromo(int id)
        {
            var promo = await _db.Promos.FindAsync(id);
            if (promo == null) return NotFound();
            promo.IsActive = !promo.IsActive;
            await _db.SaveChangesAsync();
            return Ok(new { message = promo.IsActive ? "Промокод активирован" : "Промокод деактивирован", promo.IsActive });
        }

        [HttpDelete("promos/{id}")]
        public async Task<IActionResult> DeletePromo(int id)
        {
            var promo = await _db.Promos.FindAsync(id);
            if (promo == null) return NotFound();
            _db.Promos.Remove(promo);
            await _db.SaveChangesAsync();
            return Ok(new { message = "Промокод удалён" });
        }

        // ===== АКЦИИ РЕСТОРАНОВ =====
        [HttpGet("restaurant-promos")]
        public async Task<IActionResult> GetRestaurantPromos()
        {
            var promos = await _db.RestaurantPromos
                .Include(p => p.Restaurant)
                .Select(p => new {
                    p.Id,
                    p.Title,
                    p.Description,
                    p.Type,
                    p.MinOrderAmount,
                    p.BuyQuantity,
                    p.GetQuantity,
                    p.FreeMenuItemId,
                    p.IsActive,
                    p.RestaurantId,
                    RestaurantName = p.Restaurant.Name
                })
                .ToListAsync();
            return Ok(promos);
        }

        [HttpPost("restaurant-promos")]
        public async Task<IActionResult> CreateRestaurantPromo([FromBody] JsonElement body)
        {
            var promo = new RestaurantPromo
            {
                RestaurantId = body.TryGetProperty("restaurantId", out var rid) ? rid.GetInt32() : 0,
                Title = body.TryGetProperty("title", out var title) ? title.GetString()! : string.Empty,
                Description = body.TryGetProperty("description", out var desc) ? desc.GetString()! : string.Empty,
                Type = body.TryGetProperty("type", out var type) ? (RestaurantPromoType)type.GetInt32() : RestaurantPromoType.FreeItemOnSum,
                MinOrderAmount = body.TryGetProperty("minOrderAmount", out var min) ? (decimal)min.GetDouble() : 0,
                IsActive = true,
                FreeMenuItemId = body.TryGetProperty("freeMenuItemId", out var freeId) && freeId.ValueKind != JsonValueKind.Null
                    ? freeId.GetInt32() : null,
                BuyQuantity = body.TryGetProperty("buyQuantity", out var buyQ) && buyQ.ValueKind != JsonValueKind.Null
                    ? buyQ.GetInt32() : null,
                GetQuantity = body.TryGetProperty("getQuantity", out var getQ) && getQ.ValueKind != JsonValueKind.Null
                    ? getQ.GetInt32() : null,
                TargetMenuItemId = body.TryGetProperty("targetMenuItemId", out var targetId) && targetId.ValueKind != JsonValueKind.Null
                    ? targetId.GetInt32() : null,
            };

            if (promo.RestaurantId == 0)
                return BadRequest(new { message = "Не указан ресторан" });

            _db.RestaurantPromos.Add(promo);
            await _db.SaveChangesAsync();
            return Ok(promo);
        }

        [HttpPut("restaurant-promos/{id}")]
public async Task<IActionResult> UpdateRestaurantPromo(int id, [FromBody] JsonElement body)
{
    var promo = await _db.RestaurantPromos.FindAsync(id);
    if (promo == null) return NotFound();

    if (body.TryGetProperty("title", out var title)) promo.Title = title.GetString()!;
    if (body.TryGetProperty("description", out var desc)) promo.Description = desc.GetString()!;
    if (body.TryGetProperty("minOrderAmount", out var min)) promo.MinOrderAmount = (decimal)min.GetDouble();
    if (body.TryGetProperty("isActive", out var active)) promo.IsActive = active.GetBoolean();
    if (body.TryGetProperty("freeMenuItemId", out var freeId))
        promo.FreeMenuItemId = freeId.ValueKind != JsonValueKind.Null ? freeId.GetInt32() : null;
    if (body.TryGetProperty("buyQuantity", out var buyQ))
        promo.BuyQuantity = buyQ.ValueKind != JsonValueKind.Null ? buyQ.GetInt32() : null;
    if (body.TryGetProperty("getQuantity", out var getQ))
        promo.GetQuantity = getQ.ValueKind != JsonValueKind.Null ? getQ.GetInt32() : null;
    if (body.TryGetProperty("targetMenuItemId", out var targetId))
        promo.TargetMenuItemId = targetId.ValueKind != JsonValueKind.Null ? targetId.GetInt32() : null;
    
    await _db.SaveChangesAsync();
    return Ok(promo);
}

        [HttpDelete("restaurant-promos/{id}")]
        public async Task<IActionResult> DeleteRestaurantPromo(int id)
        {
            var promo = await _db.RestaurantPromos.FindAsync(id);
            if (promo == null) return NotFound();
            _db.RestaurantPromos.Remove(promo);
            await _db.SaveChangesAsync();
            return Ok(new { message = "Акция удалена" });
        }

        [HttpPut("restaurant-promos/{id}/toggle")]
        public async Task<IActionResult> ToggleRestaurantPromo(int id)
        {
            var promo = await _db.RestaurantPromos.FindAsync(id);
            if (promo == null) return NotFound();
            promo.IsActive = !promo.IsActive;
            await _db.SaveChangesAsync();
            return Ok(new { message = promo.IsActive ? "Акция активирована" : "Акция деактивирована", promo.IsActive });
        }
    }
}