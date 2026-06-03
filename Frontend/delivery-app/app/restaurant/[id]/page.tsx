'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import MenuItemCard from '@/components/MenuItemCard';
import { getRestaurant, getRestaurantPromos } from '@/lib/api';
import { RestaurantWithMenu } from '@/types';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

interface RestaurantPromo {
  id: number;
  title: string;
  description: string;
  type: number;
  minOrderAmount: number;
  buyQuantity?: number;
  getQuantity?: number;
  freeMenuItemId?: number;
}

export default function RestaurantPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [restaurant, setRestaurant] = useState<RestaurantWithMenu | null>(null);
  const [promos, setPromos] = useState<RestaurantPromo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Все');

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [restaurantRes, promosRes] = await Promise.all([
          getRestaurant(Number(id)),
          getRestaurantPromos(Number(id))
        ]);
        setRestaurant(restaurantRes.data);
        setPromos(promosRes.data);
      } catch {
        router.push('/');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading || authLoading) return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="h-64 bg-white rounded-2xl animate-pulse mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-white rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );

  if (!restaurant) return null;

  const categories = ['Все', ...Array.from(new Set(restaurant.menuItems.map(i => i.category)))];
  const filtered = selectedCategory === 'Все'
    ? restaurant.menuItems
    : restaurant.menuItems.filter(i => i.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Шапка ресторана */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={restaurant.imageUrl}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <Link href="/" className="text-sm text-white/70 hover:text-white mb-2 inline-block">
            ← Назад
          </Link>
          <h1 className="text-3xl font-bold">{restaurant.name}</h1>
          <div className="flex items-center gap-4 mt-2 text-sm">
            <span>⭐ {restaurant.rating}</span>
            <span>•</span>
            <span>🕐 {restaurant.deliveryTimeMin}–{restaurant.deliveryTimeMax} мин</span>
            <span>•</span>
            <span>{restaurant.cuisine}</span>
            {restaurant.hasPromo && (
              <>
                <span>•</span>
                <span className="bg-orange-500 px-2 py-0.5 rounded-lg text-xs font-bold">🔥 Акция</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">

        {/* Акции — только для пользователей */}
        {!isAdmin && promos.length > 0 && (
          <div className="mb-6">
            <h2 className="font-bold text-gray-900 text-lg mb-3">🔥 Акции</h2>
            <div className="flex flex-col gap-3">
              {promos.map(promo => (
                <div
                  key={promo.id}
                  className="bg-gradient-to-r from-orange-500 to-orange-400 rounded-2xl p-4 text-white flex items-center gap-4"
                >
                  <span className="text-3xl">🎁</span>
                  <div>
                    <p className="font-bold">{promo.title}</p>
                    <p className="text-orange-100 text-sm mt-0.5">{promo.description}</p>
                    {promo.minOrderAmount > 0 && (
                      <p className="text-orange-200 text-xs mt-1">
                        Минимальная сумма заказа: {promo.minOrderAmount} ₽
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Кнопка добавить блюдо — только для админа */}
        {isAdmin && (
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-gray-900 text-lg">Управление меню</h2>
            <Link
              href={`/admin/restaurants/${restaurant.id}/menu`}
              className="bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-orange-600 transition"
            >
              + Добавить блюдо
            </Link>
          </div>
        )}

        {/* Категории меню */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {categories.map(c => (
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

        {/* Меню */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-3">🍽️</div>
            <p>Блюда не найдены</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map(item => (
              <MenuItemCard
                key={item.id}
                item={item}
                restaurantId={restaurant.id}
                restaurantName={restaurant.name}
                isAdmin={isAdmin}
                onDeleted={() => window.location.reload()}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}