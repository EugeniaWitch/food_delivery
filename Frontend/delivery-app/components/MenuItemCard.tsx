'use client';

import { MenuItem } from '@/types';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { addFavorite, removeFavorite, getFavorites, adminDeleteMenuItem } from '@/lib/api';

interface Props {
  item: MenuItem;
  restaurantId: number;
  restaurantName: string;
  isAdmin?: boolean;
  onDeleted?: () => void;
}

export default function MenuItemCard({ item, restaurantId, restaurantName, isAdmin, onDeleted }: Props) {
  const { addItem, items, restaurantId: cartRestaurantId, updateQuantity, removeItem } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [showWarning, setShowWarning] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const handleAdminDelete = async () => {
    if (!confirm(`Удалить "${item.name}"?`)) return;
    try {
      await adminDeleteMenuItem(item.id);
      onDeleted?.();
    } catch {
      console.error('Ошибка удаления блюда');
    }
  };

  const cartItem = items.find(i => i.menuItemId === item.id);
  const isDifferentRestaurant = cartRestaurantId && cartRestaurantId !== restaurantId;

  useEffect(() => {
    if (!user) return;
    getFavorites().then(res => {
      const favs = res.data;
      setIsFavorite(favs.some((f: any) => f.menuItemId === item.id));
    }).catch(() => {});
  }, [user, item.id]);

  const handleAdd = () => {
    if (!user) { router.push('/login'); return; }
    if (isDifferentRestaurant) { setShowWarning(true); return; }
    addItem({
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      imageUrl: item.imageUrl,
      quantity: 1,
      restaurantId,
      restaurantName,
    });
  };

  const handleFavorite = async () => {
    if (!user) { router.push('/login'); return; }
    setFavLoading(true);
    try {
      if (isFavorite) {
        await removeFavorite(item.id);
        setIsFavorite(false);
      } else {
        await addFavorite(item.id);
        setIsFavorite(true);
      }
    } catch {
      console.error('Ошибка избранного');
    } finally {
      setFavLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 flex gap-4 shadow-sm hover:shadow-md transition relative">
      <img
        src={item.imageUrl}
        alt={item.name}
        className="w-24 h-24 object-cover rounded-xl flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-semibold text-gray-900">{item.name}</h4>
          {/* Сердечко только для обычных пользователей */}
          {!isAdmin && (
            <button
              onClick={handleFavorite}
              disabled={favLoading}
              className="flex-shrink-0 text-xl transition hover:scale-110 disabled:opacity-50"
              title={isFavorite ? 'Убрать из избранного' : 'В избранное'}
            >
              {isFavorite ? '❤️' : '🤍'}
            </button>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>
        <div className="flex items-center justify-between mt-3">
          <span className="font-bold text-gray-900">{item.price} ₽</span>

          {/* Кнопки корзины только для обычных пользователей */}
          {!isAdmin && (
            cartItem ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, cartItem.quantity - 1)}
                  className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold hover:bg-orange-200 transition"
                >−</button>
                <span className="font-medium w-4 text-center">{cartItem.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, cartItem.quantity + 1)}
                  className="w-8 h-8 rounded-full bg-orange-500 text-white font-bold hover:bg-orange-600 transition"
                >+</button>
              </div>
            ) : (
              <button
                onClick={handleAdd}
                className="bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-orange-600 transition"
              >+ Добавить</button>
            )
          )}

          {/* Кнопки редактирования для админа */}
          {isAdmin && (
            <div className="flex gap-2">
              <button
                onClick={() => router.push(`/admin/menu/${item.id}/edit`)}
                className="bg-orange-50 text-orange-500 text-xs px-3 py-1.5 rounded-lg hover:bg-orange-100 transition"
              >✏️ Изменить</button>
              <button
                onClick={handleAdminDelete}
                className="bg-red-50 text-red-400 text-xs px-3 py-1.5 rounded-lg hover:bg-red-100 transition"
              >🗑️ Удалить</button>
            </div>
          )}
        </div>
      </div>

      {showWarning && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm mx-4">
            <h3 className="font-bold text-lg text-gray-900">В корзине есть товары из другого ресторана</h3>
            <p className="text-gray-500 mt-2 text-sm">
              Вы не можете добавить блюда из разных ресторанов в один заказ. Перейдите в корзину, чтобы оформить текущий заказ.
            </p>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowWarning(false)}
                className="flex-1 border border-gray-200 rounded-xl py-2 text-sm hover:bg-gray-50"
              >Отмена</button>
              <button
                onClick={() => router.push('/cart')}
                className="flex-1 bg-orange-500 text-white rounded-xl py-2 text-sm hover:bg-orange-600"
              >В корзину</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}