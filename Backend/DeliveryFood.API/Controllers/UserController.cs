using DeliveryFood.API.Data;
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
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _db;

        public UserController(AppDbContext db)
        {
            _db = db;
        }

        // Получить профиль
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var user = await _db.Users.FindAsync(userId);
            if (user == null) return NotFound();

            return Ok(new
            {
                user.Id,
                user.Email,
                user.AvatarUrl,
                user.DeliveryAddress,
                user.CreatedAt,
                user.Role
            });
        }

        // Обновить адрес доставки
        [HttpPut("address")]
        public async Task<IActionResult> UpdateAddress([FromBody] UpdateAddressDto dto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var user = await _db.Users.FindAsync(userId);
            if (user == null) return NotFound();

            user.DeliveryAddress = dto.Address;
            await _db.SaveChangesAsync();

            return Ok(new { message = "Адрес обновлён!" });
        }

        // Избранное — получить
        [HttpGet("favorites")]
        public async Task<IActionResult> GetFavorites()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var favorites = await _db.FavoriteItems
                .Where(f => f.UserId == userId)
                .Include(f => f.MenuItem)
                    .ThenInclude(m => m.Restaurant)
                .Select(f => new
                {
                    f.Id,
                    f.MenuItemId,
                    f.MenuItem.Name,
                    f.MenuItem.Price,
                    f.MenuItem.ImageUrl,
                    RestaurantName = f.MenuItem.Restaurant.Name,
                    f.MenuItem.RestaurantId
                })
                .ToListAsync();

            return Ok(favorites);
        }

        // Избранное — добавить
        [HttpPost("favorites/{menuItemId}")]
        public async Task<IActionResult> AddFavorite(int menuItemId)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var exists = await _db.FavoriteItems
                .AnyAsync(f => f.UserId == userId && f.MenuItemId == menuItemId);

            if (exists)
                return BadRequest(new { message = "Уже в избранном" });

            _db.FavoriteItems.Add(new FavoriteItem
            {
                UserId = userId,
                MenuItemId = menuItemId
            });

            await _db.SaveChangesAsync();
            return Ok(new { message = "Добавлено в избранное!" });
        }

        // Избранное — удалить
        [HttpDelete("favorites/{menuItemId}")]
        public async Task<IActionResult> RemoveFavorite(int menuItemId)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var favorite = await _db.FavoriteItems
                .FirstOrDefaultAsync(f => f.UserId == userId && f.MenuItemId == menuItemId);

            if (favorite == null)
                return NotFound();

            _db.FavoriteItems.Remove(favorite);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Удалено из избранного!" });
        }
    }

    public class UpdateAddressDto
    {
        public string Address { get; set; } = string.Empty;
    }
}