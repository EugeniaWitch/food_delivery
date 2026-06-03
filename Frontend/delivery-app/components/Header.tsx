'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useState, useEffect } from 'react';

export default function Header() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const isAdmin = user?.role === 'admin';

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">

        {/* Логотип */}
        <Link href={isAdmin ? '/admin' : '/'} className="text-xl font-bold text-orange-500 whitespace-nowrap">
          🍕 FoodDelivery {isAdmin && <span className="text-sm bg-orange-100 text-orange-600 px-2 py-0.5 rounded-lg ml-1">Админ</span>}
        </Link>

        {/* Адрес — только для обычных пользователей */}
        {!isAdmin && (
          <button className="hidden md:flex items-center gap-1 text-sm text-gray-600 hover:text-orange-500 transition">
            <span>📍</span>
            <span className="max-w-[200px] truncate">
              {user?.deliveryAddress || 'Укажите адрес доставки'}
            </span>
          </button>
        )}

        <div className="flex items-center gap-3 ml-auto">

          {/* Корзина — только для обычных пользователей */}
          {!isAdmin && (
            <Link
              href="/cart"
              className="relative flex items-center gap-1 bg-orange-50 hover:bg-orange-100 text-orange-600 px-3 py-2 rounded-xl transition"
            >
              <span className="text-lg">🛒</span>
              <span className="hidden sm:inline text-sm font-medium">Корзина</span>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          )}

          {/* Промокоды — только для админа */}
          {isAdmin && (
            <Link
              href="/admin/promos"
              className="flex items-center gap-1 bg-orange-50 hover:bg-orange-100 text-orange-600 px-3 py-2 rounded-xl transition text-sm font-medium"
            >
              🎟️ Промокоды
            </Link>
          )}

          {/* Поддержка — только для обычных пользователей */}
          {!isAdmin && (
            <Link
              href="/support"
              className="hidden sm:flex items-center gap-1 text-sm text-gray-600 hover:text-orange-500 transition"
            >
              <span>💬</span>
              <span>Поддержка</span>
            </Link>
          )}

          {/* Аккаунт */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 bg-orange-500 text-white px-3 py-2 rounded-xl hover:bg-orange-600 transition"
              >
                <span className="text-lg">{isAdmin ? '⚙️' : '👤'}</span>
                <span className="hidden sm:inline text-sm font-medium truncate max-w-[100px]">
                  {isAdmin ? 'Админ' : user.email.split('@')[0]}
                </span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  {isAdmin ? (
                    <>
                      <Link href="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50" onClick={() => setMenuOpen(false)}>
                        🏠 Главная админки
                      </Link>
                      <Link href="/admin/stats" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50" onClick={() => setMenuOpen(false)}>
                        📊 Статистика
                      </Link>
                      <Link href="/admin/promos" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50" onClick={() => setMenuOpen(false)}>
                        🎟️ Промокоды
                      </Link>
                      <Link href="/admin/restaurant-promos" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50" onClick={() => setMenuOpen(false)}>
                        🔥 Акции
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50" onClick={() => setMenuOpen(false)}>
                        👤 Личный кабинет
                      </Link>
                      <Link href="/profile/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50" onClick={() => setMenuOpen(false)}>
                        📦 История заказов
                      </Link>
                      <Link href="/profile/favorites" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50" onClick={() => setMenuOpen(false)}>
                        ❤️ Избранное
                      </Link>
                    </>
                  )}
                  <hr className="my-1" />
                  <button
                    onClick={() => { logout(); setMenuOpen(false); }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                  >
                    🚪 Выйти
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-orange-600 transition">
              Войти
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}