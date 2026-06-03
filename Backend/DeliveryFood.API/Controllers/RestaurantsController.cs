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
    var allRestaurants = await _db.Restaurants.ToListAsync();

    var query = allRestaurants.AsQueryable();

    if (!string.IsNullOrEmpty(cuisine))
        query = query.Where(r => r.Cuisine.ToLower().Contains(cuisine.ToLower()));

    if (!string.IsNullOrEmpty(category))
        query = query.Where(r => r.Category.ToLower().Contains(category.ToLower()));

    if (hasPromo == true)
        query = query.Where(r => r.HasPromo);

    if (highRating == true)
        query = query.Where(r => r.Rating >= 4.5);

    if (!string.IsNullOrEmpty(search))
        query = query.Where(r => r.Name.ToLower().Contains(search.ToLower()));

    var restaurants = query.Select(r => new
    {
        r.Id,
        r.Name,
        r.ImageUrl,
        r.Rating,
        r.DeliveryTimeMin,
        r.DeliveryTimeMax,
        r.Cuisine,
        r.Category,
        r.HasPromo
    }).ToList();

    return Ok(restaurants);
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
            restaurant.HasPromo,
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
    }
}
    }
}