'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Header from '@/components/Header';
import Link from 'next/link';
import AuthGuard from '@/components/AuthGuard';

export default function AdminPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  return (
    <AuthGuard requireAdmin>
        <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">⚙️ Панель администратора</h1>
        <p className="text-gray-500 mb-8">Управление сайтом доставки еды</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/" className="bg-white rounded-2xl p-6 hover:shadow-md transition">
            <div className="text-3xl mb-3">🏪</div>
            <h2 className="font-bold text-gray-900">Рестораны</h2>
            <p className="text-sm text-gray-400 mt-1">Добавить, изменить или удалить рестораны и их меню</p>
          </Link>

          <Link href="/admin/stats" className="bg-white rounded-2xl p-6 hover:shadow-md transition">
            <div className="text-3xl mb-3">📊</div>
            <h2 className="font-bold text-gray-900">Статистика</h2>
            <p className="text-sm text-gray-400 mt-1">Отчёты по заказам, ресторанам и пользователям</p>
          </Link>

          <Link href="/admin/promos" className="bg-white rounded-2xl p-6 hover:shadow-md transition">
            <div className="text-3xl mb-3">🎟️</div>
            <h2 className="font-bold text-gray-900">Промокоды</h2>
            <p className="text-sm text-gray-400 mt-1">Управление промокодами и скидками</p>
          </Link>

          <Link href="/admin/restaurant-promos" className="bg-white rounded-2xl p-6 hover:shadow-md transition">
            <div className="text-3xl mb-3">🔥</div>
            <h2 className="font-bold text-gray-900">Акции ресторанов</h2>
            <p className="text-sm text-gray-400 mt-1">Включить или выключить акции</p>
          </Link>
        </div>
      </div>
    </div>
    </AuthGuard>
  );
}