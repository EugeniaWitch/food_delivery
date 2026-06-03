namespace DeliveryFood.API.Models
{
    public class RestaurantPromo
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public RestaurantPromoType Type { get; set; }
        public decimal MinOrderAmount { get; set; }  // Минимальная сумма для акции
        public int? BuyQuantity { get; set; }        // Купи N штук
        public int? GetQuantity { get; set; }        // Получи M штук бесплатно
        public int? FreeMenuItemId { get; set; }     // Какой товар бесплатно
        public int? TargetMenuItemId { get; set; }  // На какое блюдо распространяется акция BuyNGetM
        public bool IsActive { get; set; } = true;
        public int RestaurantId { get; set; }
        public Restaurant Restaurant { get; set; } = null!;
    }

    public enum RestaurantPromoType
    {
        BuyNGetM,       // Купи N получи M
        FreeItemOnSum   // Бесплатный товар от суммы
    }
}