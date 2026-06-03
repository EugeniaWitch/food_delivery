'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Restaurant } from '@/types';
import { adminDeleteRestaurant } from '@/lib/api';
import { useState } from 'react';

interface Props {
  restaurant: Restaurant;
  isAdmin?: boolean;
  onDeleted?: () => void;
}

export default function RestaurantCard({ restaurant, isAdmin, onDeleted }: Props) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await adminDeleteRestaurant(restaurant.id);
      onDeleted?.();
    } catch {
      console.error('Ошибка удаления');
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition group relative">

        {/* Картинка */}
        <Link href={`/restaurant/${restaurant.id}`}>
          <div className="relative h-48 overflow-hidden">
            <img
              src={restaurant.imageUrl}
              alt={restaurant.name}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
            {restaurant.hasPromo && (
              <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                🔥 Акция
              </span>
            )}
          </div>
        </Link>

        {/* Инфо */}
        <div className="p-4">
          <Link href={`/restaurant/${restaurant.id}`}>
            <h3 className="font-bold text-gray-900 text-lg">{restaurant.name}</h3>
            <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                ⭐ <span className="font-medium text-gray-700">{restaurant.rating}</span>
              </span>
              <span>•</span>
              <span>🕐 {restaurant.deliveryTimeMin}–{restaurant.deliveryTimeMax} мин</span>
            </div>
            <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span className="bg-orange-50 text-orange-600 text-xs px-2 py-1 rounded-lg">{restaurant.cuisine}</span>
            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-lg">{restaurant.category}</span>
            {restaurant.category2 && <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-lg">{restaurant.category2}</span>}
            {restaurant.category3 && <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-lg">{restaurant.category3}</span>}
          </div>
          </Link>

          {/* Кнопки админа */}
          {isAdmin && (
            <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
              <Link
                href={`/admin/restaurants/${restaurant.id}/edit`}
                className="flex-1 text-center bg-orange-50 text-orange-600 text-sm py-2 rounded-xl hover:bg-orange-100 transition font-medium"
              >
                ✏️ Изменить
              </Link>
              <button
                onClick={() => setShowConfirm(true)}
                className="flex-1 bg-red-50 text-red-500 text-sm py-2 rounded-xl hover:bg-red-100 transition font-medium"
              >
                🗑️ Удалить
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Подтверждение удаления */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm mx-4">
            <h3 className="font-bold text-lg text-gray-900">Удалить ресторан?</h3>
            <p className="text-gray-500 mt-2 text-sm">
              Вы уверены что хотите удалить <span className="font-medium">{restaurant.name}</span>? Это действие нельзя отменить.
            </p>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 border border-gray-200 rounded-xl py-2 text-sm hover:bg-gray-50"
              >
                Отмена
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 bg-red-500 text-white rounded-xl py-2 text-sm hover:bg-red-600 disabled:opacity-50"
              >
                {deleting ? 'Удаляем...' : 'Удалить'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}