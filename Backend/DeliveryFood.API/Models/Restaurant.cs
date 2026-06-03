namespace DeliveryFood.API.Models
{
    public class Restaurant
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public double Rating { get; set; }
        public int DeliveryTimeMin { get; set; }
        public int DeliveryTimeMax { get; set; }
        public string Cuisine { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string? Category2 { get; set; }
        public string? Category3 { get; set; }
        public bool HasPromo { get; set; } = false;

        public ICollection<MenuItem> MenuItems { get; set; } = new List<MenuItem>();
    }
}