'use client';

import { useEffect, useRef, useState } from 'react';
import Header from '@/components/Header';
import RestaurantCard from '@/components/RestaurantCard';
import { getRestaurants } from '@/lib/api';
import Link from 'next/link';
import { Restaurant } from '@/types';
import { useAuth } from '@/context/AuthContext';

const CUISINES = ['Все', 'Русская', 'Итальянская', 'Японская', 'Восточная', 'Грузинская', 'Кавказская', 'Узбекская', 'Европейская', 'Азиатская', 'Американская', 'Мексиканская'];
const CATEGORIES = ['Все', 'Бургеры', 'Пицца', 'Суши', 'Шаурма', 'Вок', 'Паста', 'Шашлык', 'Десерты', 'Фастфуд', 'Завтраки', 'Роллы', 'Кофе', 'Выпечка', 'Супы', 'Стейки'];

export default function HomePage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('Все');
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [hasPromo, setHasPromo] = useState(false);
  const [highRating, setHighRating] = useState(false);
  const { user } = useAuth();
  const restaurantsSectionRef = useRef<HTMLDivElement | null>(null);

  const [totalMenuPrice, setTotalMenuPrice] = useState<number>(0);

  const fetchRestaurants = async () => {
    setLoading(true);

    try {
      const res = await getRestaurants({
        search: search || undefined,
        cuisine: selectedCuisine !== 'Все' ? selectedCuisine : undefined,
        category: selectedCategory !== 'Все' ? selectedCategory : undefined,
        hasPromo: hasPromo || undefined,
        highRating: highRating || undefined,
      });

      setRestaurants(res.data.restaurants ?? []);
      setTotalMenuPrice(res.data.totalMenuPrice ?? 0);
    } catch {
      console.error('Ошибка загрузки ресторанов');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, [search, selectedCuisine, selectedCategory, hasPromo, highRating]);

    const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
    };

    const scrollToRestaurants = () => {
      if (!restaurantsSectionRef.current) return;

      const offset = 50;

      const elementPosition = restaurantsSectionRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Баннер */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-400 text-white">
        <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Доставка за 30 минут</h1>
            <p className="mt-2 text-orange-100 text-lg">Скидка 20% на первый заказ по промокоду <span className="font-bold text-white">FOOD20</span></p>
            <button
              type="button"
              onClick={scrollToRestaurants}
              className="mt-4 bg-white text-orange-500 font-bold px-6 py-3 rounded-xl hover:bg-orange-50 transition"
            >
              Заказать сейчас
            </button>
          </div>
          <div className="text-8xl">🍔</div>
        </div>
      </div>

      

      <div ref={restaurantsSectionRef} className="max-w-7xl mx-auto px-4 py-8 scroll-mt-4">

        {/* Поиск */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-6">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="🔍 Поиск ресторана..."
            className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
          <button
            type="submit"
            className="bg-orange-500 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-orange-600 transition"
          >
            Найти
          </button>
        </form>

        {/* Фильтры — кухня */}
        <div className="flex flex-wrap gap-2 mb-3">
          {CUISINES.map(c => (
            <button
              key={c}
              onClick={() => setSelectedCuisine(c)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition ${
                selectedCuisine === c
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Фильтры — категории */}
        <div className="flex flex-wrap gap-2 mb-3">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition ${
                selectedCategory === c
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Доп фильтры */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setHasPromo(!hasPromo)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition ${
              hasPromo
                ? 'bg-orange-500 text-white border-orange-500'
                : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'
            }`}
          >
            🔥 Акции
          </button>
          <button
            onClick={() => setHighRating(!highRating)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition ${
              highRating
                ? 'bg-orange-500 text-white border-orange-500'
                : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'
            }`}
          >
            ⭐ Высокий рейтинг
          </button>
        </div>

        {/* Кнопка добавить ресторан — только для админа */}
        {user?.role === 'admin' && (
          <div className="mb-6">
            <Link
              href="/admin/restaurants/new"
              className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-orange-600 transition"
            >
              + Добавить ресторан
            </Link>
          </div>
        )}

        {/* Список ресторанов */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-64 animate-pulse" />
            ))}
          </div>
        ) : restaurants.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🍽️</div>
            <p className="text-gray-500 text-lg">Ничего не найдено</p>
            <p className="text-gray-400 text-sm mt-1">Попробуйте изменить фильтры</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map(r => (
              <RestaurantCard
                key={r.id}
                restaurant={r}
                isAdmin={user?.role === 'admin'}
                onDeleted={() => fetchRestaurants()}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}