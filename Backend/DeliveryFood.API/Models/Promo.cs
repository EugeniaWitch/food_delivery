namespace DeliveryFood.API.Models
{
    public class Promo
    {
        public int Id { get; set; }
        public string Code { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public PromoType Type { get; set; }
        public decimal DiscountPercent { get; set; } // Скидка в %
        public decimal MinOrderAmount { get; set; }  // Минимальная сумма заказа
        public DateTime ExpiresAt { get; set; }
        public bool IsActive { get; set; } = true;

        public ICollection<UsedPromo> UsedPromos { get; set; } = new List<UsedPromo>();
    }

    public enum PromoType
    {
        Discount,      // Скидка в %
        FreeItem       // Бесплатный товар
    }
}