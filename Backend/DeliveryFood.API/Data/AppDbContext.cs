using DeliveryFood.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DeliveryFood.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Restaurant> Restaurants { get; set; }
        public DbSet<MenuItem> MenuItems { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<FavoriteItem> FavoriteItems { get; set; }
        public DbSet<Promo> Promos { get; set; }
        public DbSet<UsedPromo> UsedPromos { get; set; }
        public DbSet<RestaurantPromo> RestaurantPromos { get; set; }
    }
}