'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { createOrder, applyPromo, getRestaurantPromos } from '@/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface RestaurantPromo {
  id: number;
  title: string;
  description: string;
  type: number;
  minOrderAmount: number;
  freeMenuItemId?: number;
  buyQuantity?: number;
}

interface AppliedPromo {
  promoId: number;
  description: string;
  discountPercent: number;
  discountAmount: number;
  newTotal: number;
}

export default function CartPage() {
  const { items, restaurantId, restaurantName, totalPrice, updateQuantity, removeItem, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [address, setAddress] = useState(user?.deliveryAddress || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [promoCode, setPromoCode] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<AppliedPromo | null>(null);

  const [restaurantPromos, setRestaurantPromos] = useState<RestaurantPromo[]>([]);
  const [activeRestaurantPromo, setActiveRestaurantPromo] = useState<RestaurantPromo | null>(null);

  // Загружаем акции ресторана
  useEffect(() => {
    if (!restaurantId) return;
    getRestaurantPromos(restaurantId)
      .then(res => setRestaurantPromos(res.data))
      .catch(() => {});
  }, [restaurantId]);

  // Проверяем какая акция ресторана применяется
  useEffect(() => {
    if (restaurantPromos.length === 0) return;
    const active = restaurantPromos.find(p => totalPrice >= p.minOrderAmount);
    setActiveRestaurantPromo(active || null);
  }, [restaurantPromos, totalPrice]);

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    setPromoLoading(true);
    setPromoError('');
    setAppliedPromo(null);
    try {
      const res = await applyPromo(promoCode, totalPrice);
      setAppliedPromo(res.data);
    } catch (err: any) {
      setPromoError(err.response?.data?.message || 'Ошибка применения промокода');
    } finally {
      setPromoLoading(false);
    }
  };

  const finalTotal = appliedPromo ? appliedPromo.newTotal : totalPrice;

  const handleOrder = async () => {
    if (!address.trim()) { setError('Укажите адрес доставки'); return; }
    if (!restaurantId) return;
    setLoading(true);
    setError('');
    try {
      await createOrder({
        restaurantId,
        deliveryAddress: address,
        promoCode: appliedPromo ? promoCode : undefined,
        items: items.map(i => ({
          menuItemId: i.menuItemId,
          quantity: i.quantity,
          price: i.price,
        })),
      });
      setSuccess(true);
      clearCart();
    } catch {
      setError('Ошибка при оформлении заказа');
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="text-7xl mb-6">🎉</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Заказ оформлен!</h2>
        <p className="text-gray-500 mb-8">Ваш заказ принят и уже готовится</p>
        <div className="flex flex-col gap-3">
          <Link href="/" className="bg-orange-500 text-white py-3 rounded-xl font-medium hover:bg-orange-600 transition">
            На главную
          </Link>
          <Link href="/profile/orders" className="border border-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition">
            История заказов
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">🛒 Корзина</h1>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🛒</div>
            <p className="text-gray-500 text-lg">Корзина пуста</p>
            <Link href="/" className="mt-6 inline-block bg-orange-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-orange-600 transition">
              Выбрать ресторан
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">

            {/* Ресторан */}
            <div className="bg-white rounded-2xl p-4 flex items-center gap-3">
              <span className="text-2xl">🏪</span>
              <div>
                <p className="text-xs text-gray-400">Ресторан</p>
                <p className="font-semibold text-gray-900">{restaurantName}</p>
              </div>
            </div>

            {/* Акция ресторана */}
            {restaurantPromos.length > 0 && (
              <div className="flex flex-col gap-2">
                {restaurantPromos.map(promo => {
                  const isActive = promo.type === 1
                ? totalPrice >= promo.minOrderAmount
                : items.some(i => i.restaurantId === restaurantId && i.quantity >= (promo.buyQuantity || 2));
                  return (
                    <div
                      key={promo.id}
                      className={`rounded-2xl p-4 flex items-center gap-3 ${
                        isActive
                          ? 'bg-gradient-to-r from-orange-500 to-orange-400 text-white'
                          : 'bg-orange-50 border border-orange-200'
                      }`}
                    >
                      <span className="text-2xl">🎁</span>
                      <div className="flex-1">
                        <p className={`font-bold text-sm ${isActive ? 'text-white' : 'text-orange-700'}`}>
                          {promo.title}
                        </p>
                        <p className={`text-xs mt-0.5 ${isActive ? 'text-orange-100' : 'text-orange-500'}`}>
                          {isActive ? '✅ Акция применена!' : `Ещё ${promo.minOrderAmount - totalPrice} ₽ до акции`}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Позиции */}
            <div className="bg-white rounded-2xl overflow-hidden">
              {items.map((item, idx) => (
                <div
                  key={item.menuItemId}
                  className={`flex items-center gap-4 p-4 ${idx !== items.length - 1 ? 'border-b border-gray-100' : ''}`}
                >
                  <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-xl flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.price} ₽ × {item.quantity}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                      className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold hover:bg-orange-200 transition"
                    >−</button>
                    <span className="w-4 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-orange-500 text-white font-bold hover:bg-orange-600 transition"
                    >+</button>
                    <button
                      onClick={() => removeItem(item.menuItemId)}
                      className="ml-2 text-gray-300 hover:text-red-400 transition text-lg"
                    >✕</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Промокод */}
            <div className="bg-white rounded-2xl p-4">
              <p className="text-sm font-medium text-gray-700 mb-2">🎟️ Промокод</p>
              {appliedPromo ? (
                <div className="bg-green-50 rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <p className="text-green-700 font-medium text-sm">✅ {appliedPromo.description}</p>
                    <p className="text-green-500 text-xs mt-0.5">Скидка: −{appliedPromo.discountAmount} ₽</p>
                  </div>
                  <button
                    onClick={() => { setAppliedPromo(null); setPromoCode(''); }}
                    className="text-gray-400 hover:text-red-400 transition"
                  >✕</button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={e => setPromoCode(e.target.value.toUpperCase())}
                    placeholder="Введите промокод"
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                  <button
                    onClick={handleApplyPromo}
                    disabled={promoLoading || !promoCode.trim()}
                    className="bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-orange-600 transition disabled:opacity-50"
                  >
                    {promoLoading ? '...' : 'Применить'}
                  </button>
                </div>
              )}
              {promoError && (
                <p className="text-red-500 text-xs mt-2">{promoError}</p>
              )}
            </div>

            {/* Адрес */}
            <div className="bg-white rounded-2xl p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">📍 Адрес доставки</label>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="Введите адрес доставки"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
            </div>

            {/* Итог */}
            <div className="bg-white rounded-2xl p-4">
              <div className="flex flex-col gap-2 mb-4">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Сумма заказа</span>
                  <span>{totalPrice} ₽</span>
                </div>
                {appliedPromo && (
                  <div className="flex justify-between text-sm text-green-500">
                    <span>Скидка по промокоду</span>
                    <span>−{appliedPromo.discountAmount} ₽</span>
                  </div>
                )}
                {activeRestaurantPromo && (
                  <div className="flex justify-between text-sm text-orange-500">
                    <span>🎁 {activeRestaurantPromo.title}</span>
                    <span>применена</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-gray-900 text-lg pt-2 border-t border-gray-100">
                  <span>Итого</span>
                  <span>{finalTotal} ₽</span>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-500 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>
              )}

              <button
                onClick={handleOrder}
                disabled={loading}
                className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition disabled:opacity-50"
              >
                {loading ? 'Оформляем...' : `Оплатить ${finalTotal} ₽`}
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}