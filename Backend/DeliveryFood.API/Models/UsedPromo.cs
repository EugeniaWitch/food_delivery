namespace DeliveryFood.API.Models
{
    public class UsedPromo
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; } = null!;
        public int PromoId { get; set; }
        public Promo Promo { get; set; } = null!;
        public DateTime UsedAt { get; set; } = DateTime.UtcNow;
    }
}