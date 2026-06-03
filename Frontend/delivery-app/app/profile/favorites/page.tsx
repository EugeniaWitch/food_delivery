'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { getFavorites, removeFavorite } from '@/lib/api';
import { FavoriteItem } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function FavoritesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    getFavorites()
      .then(res => setFavorites(res.data))
      .catch(() => setFavorites([]))
      .finally(() => setLoading(false));
  }, [user]);

  const handleRemove = async (menuItemId: number) => {
    try {
      await removeFavorite(menuItemId);
      setFavorites(prev => prev.filter(f => f.menuItemId !== menuItemId));
    } catch {
      console.error('Ошибка удаления из избранного');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-8">

        <div className="flex items-center gap-3 mb-6">
          <Link href="/profile" className="text-gray-400 hover:text-gray-600">←</Link>
          <h1 className="text-2xl font-bold text-gray-900">❤️ Избранное</h1>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-white rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">❤️</div>
            <p className="text-gray-500 text-lg">Избранных блюд пока нет</p>
            <Link
              href="/"
              className="mt-6 inline-block bg-orange-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-orange-600 transition"
            >
              Найти блюда
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {favorites.map(item => (
              <div key={item.id} className="bg-white rounded-2xl p-4 flex gap-3">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-xl flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{item.name}</p>
                  <p className="text-sm text-gray-400">{item.restaurantName}</p>
                  <p className="text-orange-500 font-bold mt-1">{item.price} ₽</p>
                  <div className="flex items-center justify-between mt-2">
                    <Link
                      href={`/restaurant/${item.restaurantId}`}
                      className="text-xs text-orange-500 hover:underline"
                    >
                      Перейти →
                    </Link>
                    <button
                      onClick={() => handleRemove(item.menuItemId)}
                      className="text-gray-300 hover:text-red-400 transition text-sm"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}