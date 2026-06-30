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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    base.OnModelCreating(modelBuilder);

    modelBuilder.Entity<OrderItem>()
        .HasOne(oi => oi.Order)
        .WithMany(o => o.OrderItems)
        .HasForeignKey(oi => oi.OrderId)
        .OnDelete(DeleteBehavior.Cascade);

    modelBuilder.Entity<OrderItem>()
        .HasOne(oi => oi.MenuItem)
        .WithMany()
        .HasForeignKey(oi => oi.MenuItemId)
        .OnDelete(DeleteBehavior.NoAction);

    modelBuilder.Entity<MenuItem>()
        .Property(m => m.Price)
        .HasPrecision(18, 2);

    modelBuilder.Entity<Order>()
        .Property(o => o.TotalPrice)
        .HasPrecision(18, 2);

    modelBuilder.Entity<OrderItem>()
        .Property(oi => oi.Price)
        .HasPrecision(18, 2);

    modelBuilder.Entity<Promo>()
        .Property(p => p.DiscountPercent)
        .HasPrecision(18, 2);

    modelBuilder.Entity<Promo>()
        .Property(p => p.MinOrderAmount)
        .HasPrecision(18, 2);

    modelBuilder.Entity<RestaurantPromo>()
        .Property(rp => rp.MinOrderAmount)
        .HasPrecision(18, 2);
}
    }
}