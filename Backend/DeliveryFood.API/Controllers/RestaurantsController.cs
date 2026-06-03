using DeliveryFood.API.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DeliveryFood.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RestaurantsController : ControllerBase
    {
        private readonly AppDbContext _db;

        public RestaurantsController(AppDbContext db)
        {
            _db = db;
        }

        // Все рестораны с фильтрацией
        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] string? cuisine,
            [FromQuery] string? category,
            [FromQuery] bool? hasPromo,
            [FromQuery] bool? highRating,
            [FromQuery] string? search)
        {
            var restaurantsFromDb = await _db.Restaurants
                .Select(r => new
                {
                    r.Id,
                    r.Name,
                    r.ImageUrl,
                    r.Rating,
                    r.DeliveryTimeMin,
                    r.DeliveryTimeMax,
                    r.Cuisine,
                    r.Category,
                    r.Category2,
                    r.Category3,
                    HasPromo = _db.RestaurantPromos.Any(p => p.RestaurantId == r.Id && p.IsActive)
                })
                .ToListAsync();

            var restaurants = restaurantsFromDb.AsEnumerable();

            if (!string.IsNullOrWhiteSpace(cuisine))
            {
                var cuisineValue = cuisine.Trim().ToLower();

                restaurants = restaurants.Where(r =>
                    !string.IsNullOrWhiteSpace(r.Cuisine) &&
                    r.Cuisine.Trim().ToLower() == cuisineValue
                );
            }

            if (!string.IsNullOrWhiteSpace(category))
            {
                var categoryValue = category.Trim().ToLower();

                restaurants = restaurants.Where(r =>
                    (!string.IsNullOrWhiteSpace(r.Category) &&
                    r.Category.Trim().ToLower() == categoryValue) ||

                    (!string.IsNullOrWhiteSpace(r.Category2) &&
                    r.Category2.Trim().ToLower() == categoryValue) ||

                    (!string.IsNullOrWhiteSpace(r.Category3) &&
                    r.Category3.Trim().ToLower() == categoryValue)
                );
            }

            if (hasPromo == true)
            {
                restaurants = restaurants.Where(r => r.HasPromo);
            }

            if (highRating == true)
            {
                restaurants = restaurants.Where(r => r.Rating >= 4.5);
            }

            if (!string.IsNullOrWhiteSpace(search))
            {
                var searchValue = search.Trim().ToLower();

                restaurants = restaurants.Where(r =>
                    !string.IsNullOrWhiteSpace(r.Name) &&
                    r.Name.Trim().ToLower().Contains(searchValue)
                );
            }

            return Ok(restaurants.ToList());
        }

        // Один ресторан по id
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var restaurant = await _db.Restaurants
                    .Include(r => r.MenuItems.Where(m => m.IsAvailable))
                    .FirstOrDefaultAsync(r => r.Id == id);

                if (restaurant == null)
                    return NotFound(new { message = "Ресторан не найден" });

                var hasActivePromo = await _db.RestaurantPromos
                    .AnyAsync(p => p.RestaurantId == restaurant.Id && p.IsActive);

                return Ok(new
                {
                    restaurant.Id,
                    restaurant.Name,
                    restaurant.ImageUrl,
                    restaurant.Rating,
                    restaurant.DeliveryTimeMin,
                    restaurant.DeliveryTimeMax,
                    restaurant.Cuisine,
                    restaurant.Category,
                    restaurant.Category2,
                    restaurant.Category3,
                    HasPromo = hasActivePromo,
                    menuItems = restaurant.MenuItems.Select(m => new
                    {
                        m.Id,
                        m.Name,
                        m.Description,
                        m.Price,
                        m.ImageUrl,
                        m.Category,
                        m.IsAvailable,
                        m.RestaurantId
                    })
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }}
    }
}