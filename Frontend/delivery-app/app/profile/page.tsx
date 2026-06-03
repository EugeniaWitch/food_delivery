'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import { useAuth } from '@/context/AuthContext';
import { updateAddress } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthGuard from '@/components/AuthGuard';

export default function ProfilePage() {
  const { user, logout, refreshUser } = useAuth();
  const router = useRouter();
  const [address, setAddress] = useState(user?.deliveryAddress || '');
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSaveAddress = async () => {
    setLoading(true);
    try {
      await updateAddress(address);
      await refreshUser();
      setEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      console.error('Ошибка сохранения адреса');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-8">

          <h1 className="text-2xl font-bold text-gray-900 mb-6">👤 Личный кабинет</h1>

          <div className="bg-white rounded-2xl p-6 mb-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-3xl">
                👤
              </div>
              <div>
                <p className="font-bold text-gray-900 text-lg">{user?.email}</p>
                <p className="text-sm text-gray-400">
                  С нами с {user ? new Date(user.createdAt).toLocaleDateString('ru-RU') : ''}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📍 Адрес доставки
              </label>
              {editing ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="Введите адрес доставки"
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                  <button
                    onClick={handleSaveAddress}
                    disabled={loading}
                    className="bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-orange-600 transition disabled:opacity-50"
                  >
                    {loading ? '...' : 'Сохранить'}
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="border border-gray-200 px-4 py-2 rounded-xl text-sm hover:bg-gray-50 transition"
                  >
                    Отмена
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                  <span className="text-sm text-gray-600">
                    {user?.deliveryAddress || 'Адрес не указан'}
                  </span>
                  <button
                    onClick={() => setEditing(true)}
                    className="text-orange-500 text-sm hover:underline"
                  >
                    Изменить
                  </button>
                </div>
              )}
              {success && <p className="text-green-500 text-sm mt-2">✅ Адрес сохранён!</p>}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Link href="/profile/orders" className="bg-white rounded-2xl p-4 flex items-center justify-between hover:shadow-md transition">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📦</span>
                <div>
                  <p className="font-medium text-gray-900">История заказов</p>
                  <p className="text-sm text-gray-400">Все ваши прошлые заказы</p>
                </div>
              </div>
              <span className="text-gray-400">→</span>
            </Link>

            <Link href="/profile/favorites" className="bg-white rounded-2xl p-4 flex items-center justify-between hover:shadow-md transition">
              <div className="flex items-center gap-3">
                <span className="text-2xl">❤️</span>
                <div>
                  <p className="font-medium text-gray-900">Избранное</p>
                  <p className="text-sm text-gray-400">Сохранённые блюда</p>
                </div>
              </div>
              <span className="text-gray-400">→</span>
            </Link>

            <Link href="/support" className="bg-white rounded-2xl p-4 flex items-center justify-between hover:shadow-md transition">
              <div className="flex items-center gap-3">
                <span className="text-2xl">💬</span>
                <div>
                  <p className="font-medium text-gray-900">Поддержка</p>
                  <p className="text-sm text-gray-400">Связаться с нами</p>
                </div>
              </div>
              <span className="text-gray-400">→</span>
            </Link>

            <Link href="/about" className="bg-white rounded-2xl p-4 flex items-center justify-between hover:shadow-md transition">
              <div className="flex items-center gap-3">
                <span className="text-2xl">ℹ️</span>
                <div>
                  <p className="font-medium text-gray-900">О сервисе</p>
                  <p className="text-sm text-gray-400">Узнать о FoodDelivery</p>
                </div>
              </div>
              <span className="text-gray-400">→</span>
            </Link>

            <button
              onClick={() => { logout(); router.push('/'); }}
              className="bg-white rounded-2xl p-4 flex items-center gap-3 hover:shadow-md transition text-left"
            >
              <span className="text-2xl">🚪</span>
              <div>
                <p className="font-medium text-red-500">Выйти</p>
                <p className="text-sm text-gray-400">Выход из аккаунта</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}