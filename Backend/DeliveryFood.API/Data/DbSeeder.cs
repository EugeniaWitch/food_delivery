using DeliveryFood.API.Models;

namespace DeliveryFood.API.Data
{
    public static class DbSeeder
    {
        public static void Seed(AppDbContext db)
        {
            if (db.Restaurants.Any()) return; // Если данные уже есть — не добавляем

            var restaurants = new List<Restaurant>
            {
                new Restaurant
                {
                    Name = "Burger King",
                    ImageUrl = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
                    Rating = 4.3,
                    DeliveryTimeMin = 20,
                    DeliveryTimeMax = 35,
                    Cuisine = "Американская",
                    Category = "Бургеры",
                    Category2 = "Фастфуд",
                    HasPromo = true,
                    MenuItems = new List<MenuItem>
                    {
                        new MenuItem { Name = "Воппер", Description = "Говяжья котлета, салат, томат, лук, соус", Price = 350, ImageUrl = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300", Category = "Бургеры" },
                        new MenuItem { Name = "Чизбургер", Description = "Говяжья котлета с сыром чеддер", Price = 199, ImageUrl = "https://images.unsplash.com/photo-1550317138-10000687a72b?w=300", Category = "Бургеры" },
                        new MenuItem { Name = "Картофель фри", Description = "Хрустящий картофель фри", Price = 129, ImageUrl = "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300", Category = "Гарниры" },
                        new MenuItem { Name = "Кола 0.5л", Description = "Газированный напиток", Price = 99, ImageUrl = "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300", Category = "Напитки" },
                        new MenuItem { Name = "Луковые кольца", Description = "Хрустящие луковые кольца в панировке", Price = 149, ImageUrl = "https://images.unsplash.com/photo-1639024471283-03518883512d?w=300", Category = "Гарниры" }
                    }
                },
                new Restaurant
                {
                    Name = "Токио Суши",
                    ImageUrl = "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400",
                    Rating = 4.7,
                    DeliveryTimeMin = 30,
                    DeliveryTimeMax = 50,
                    Cuisine = "Японская",
                    Category = "Суши",
                    Category2 = "Вок",
                    Category3 = "Роллы",
                    HasPromo = false,
                    MenuItems = new List<MenuItem>
                    {
                        new MenuItem { Name = "Ролл Калифорния", Description = "Краб, авокадо, огурец, икра тобико", Price = 420, ImageUrl = "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=300", Category = "Роллы" },
                        new MenuItem { Name = "Ролл Филадельфия", Description = "Лосось, сливочный сыр, огурец", Price = 480, ImageUrl = "https://images.unsplash.com/photo-1559410545-0bdcd187e0a6?w=300", Category = "Роллы" },
                        new MenuItem { Name = "Сашими лосось", Description = "Свежий лосось 6 кусочков", Price = 390, ImageUrl = "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=300", Category = "Сашими" },
                        new MenuItem { Name = "Мисо суп", Description = "Традиционный японский суп", Price = 180, ImageUrl = "https://images.unsplash.com/photo-1547592180-85f173990554?w=300", Category = "Супы" },
                        new MenuItem { Name = "Гункан с икрой", Description = "Рис, нори, красная икра", Price = 290, ImageUrl = "https://images.unsplash.com/photo-1582450871972-ab5ca641643d?w=300", Category = "Суши" }
                    }
                },
                new Restaurant
                {
                    Name = "Мама Пицца",
                    ImageUrl = "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400",
                    Rating = 4.5,
                    DeliveryTimeMin = 25,
                    DeliveryTimeMax = 40,
                    Cuisine = "Итальянская",
                    Category = "Пицца",
                    Category2 = "Паста",
                    Category3 = "Десерты",
                    HasPromo = true,
                    MenuItems = new List<MenuItem>
                    {
                        new MenuItem { Name = "Маргарита", Description = "Томатный соус, моцарелла, базилик", Price = 520, ImageUrl = "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300", Category = "Пицца" },
                        new MenuItem { Name = "Пепперони", Description = "Томатный соус, моцарелла, пепперони", Price = 620, ImageUrl = "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300", Category = "Пицца" },
                        new MenuItem { Name = "Четыре сыра", Description = "Моцарелла, пармезан, горгонзола, чеддер", Price = 680, ImageUrl = "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300", Category = "Пицца" },
                        new MenuItem { Name = "Тирамису", Description = "Классический итальянский десерт", Price = 290, ImageUrl = "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300", Category = "Десерты" },
                        new MenuItem { Name = "Лимонад домашний", Description = "Свежевыжатый лимонад", Price = 180, ImageUrl = "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=300", Category = "Напитки" }
                    }
                },
                new Restaurant
                {
                    Name = "Шаурма Хаус",
                    ImageUrl = "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400",
                    Rating = 4.2,
                    DeliveryTimeMin = 15,
                    DeliveryTimeMax = 25,
                    Cuisine = "Восточная",
                    Category = "Шаурма",
                    Category2 = "Шашлык",
                    HasPromo = false,
                    MenuItems = new List<MenuItem>
                    {
                        new MenuItem { Name = "Шаурма классическая", Description = "Курица, овощи, соус, лаваш", Price = 280, ImageUrl = "https://images.unsplash.com/photo-1633321702518-7feccafb94d5?w=300", Category = "Шаурма" },
                        new MenuItem { Name = "Шаурма двойная", Description = "Двойная порция мяса, овощи, соус", Price = 380, ImageUrl = "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=300", Category = "Шаурма" },
                        new MenuItem { Name = "Фалафель", Description = "Жареные шарики из нута со специями", Price = 220, ImageUrl = "https://images.unsplash.com/photo-1593001872095-7d5b3868fb1d?w=300", Category = "Закуски" },
                        new MenuItem { Name = "Хумус", Description = "Паста из нута с оливковым маслом", Price = 190, ImageUrl = "https://images.unsplash.com/photo-1577805947697-89e18249d767?w=300", Category = "Закуски" },
                        new MenuItem { Name = "Айран", Description = "Освежающий кисломолочный напиток", Price = 99, ImageUrl = "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=300", Category = "Напитки" }
                    }
                },
                new Restaurant
                {
                    Name = "Борщ & Каша",
                    ImageUrl = "https://images.unsplash.com/photo-1547592180-85f173990554?w=400",
                    Rating = 4.6,
                    DeliveryTimeMin = 30,
                    DeliveryTimeMax = 45,
                    Cuisine = "Русская",
                    Category = "Супы",
                    Category2 = "Салаты",
                    Category3 = "Завтраки",
                    HasPromo = true,
                    MenuItems = new List<MenuItem>
                    {
                        new MenuItem { Name = "Борщ со сметаной", Description = "Классический борщ со свеклой и сметаной", Price = 320, ImageUrl = "https://images.unsplash.com/photo-1547592180-85f173990554?w=300", Category = "Супы" },
                        new MenuItem { Name = "Пельмени домашние", Description = "Домашние пельмени со сметаной", Price = 380, ImageUrl = "https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=300", Category = "Основные блюда" },
                        new MenuItem { Name = "Котлета по-киевски", Description = "Котлета с маслом и зеленью", Price = 420, ImageUrl = "https://images.unsplash.com/photo-1544025162-d76694265947?w=300", Category = "Основные блюда" },
                        new MenuItem { Name = "Гречневая каша", Description = "С маслом и грибами", Price = 220, ImageUrl = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300", Category = "Гарниры" },
                        new MenuItem { Name = "Компот из сухофруктов", Description = "Домашний компот", Price = 99, ImageUrl = "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300", Category = "Напитки" }
                    }
                }
            };

            db.Restaurants.AddRange(restaurants);
            db.SaveChanges();

            // Промокоды
        if (!db.Promos.Any())
        {
            db.Promos.AddRange(new List<Promo>
            {
                new Promo
                {
                    Code = "FOOD20",
                    Description = "Скидка 20% на первый заказ",
                    Type = PromoType.Discount,
                    DiscountPercent = 20,
                    MinOrderAmount = 0,
                    ExpiresAt = DateTime.UtcNow.AddYears(1),
                    IsActive = true
                },
                new Promo
                {
                    Code = "SAVE10",
                    Description = "Скидка 10% на заказ от 1000 ₽",
                    Type = PromoType.Discount,
                    DiscountPercent = 10,
                    MinOrderAmount = 1000,
                    ExpiresAt = DateTime.UtcNow.AddMonths(3),
                    IsActive = true
                }
            });
            db.SaveChanges();
        }

        // Акции ресторанов
        if (!db.RestaurantPromos.Any())
        {
            var burgerKing = db.Restaurants.First(r => r.Name == "Burger King");
            var mamaPizza = db.Restaurants.First(r => r.Name == "Мама Пицца");
            var borschKasha = db.Restaurants.First(r => r.Name == "Борщ & Каша");

            var lemonade = db.MenuItems.First(m => m.Name == "Лимонад домашний");
            var tiramisu = db.MenuItems.First(m => m.Name == "Тирамису");
            var kompot = db.MenuItems.First(m => m.Name == "Компот из сухофруктов");

            db.RestaurantPromos.AddRange(new List<RestaurantPromo>
            {
                new RestaurantPromo
                {
                    RestaurantId = burgerKing.Id,
                    Title = "2 картофеля по цене 1",
                    Description = "Закажи 2 порции картофеля фри и получи третью в подарок!",
                    Type = RestaurantPromoType.BuyNGetM,
                    BuyQuantity = 2,
                    GetQuantity = 1,
                    MinOrderAmount = 0,
                    TargetMenuItemId = db.MenuItems.First(m => m.Name == "Картофель фри" && m.RestaurantId == burgerKing.Id).Id,
                    IsActive = true
                },
                new RestaurantPromo
                {
                    RestaurantId = mamaPizza.Id,
                    Title = "Тирамису в подарок",
                    Description = "При заказе от 1500 ₽ получи Тирамису в подарок!",
                    Type = RestaurantPromoType.FreeItemOnSum,
                    MinOrderAmount = 1500,
                    FreeMenuItemId = tiramisu.Id,
                    IsActive = true
                },
                new RestaurantPromo
                {
                    RestaurantId = borschKasha.Id,
                    Title = "Компот в подарок",
                    Description = "При заказе от 700 ₽ получи Компот из сухофруктов в подарок!",
                    Type = RestaurantPromoType.FreeItemOnSum,
                    MinOrderAmount = 700,
                    FreeMenuItemId = kompot.Id,
                    IsActive = true
                }
            });
            db.SaveChanges();
            }
        }
    }
}