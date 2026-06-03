'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { adminGetStats } from '@/lib/api';
import Link from 'next/link';

export default function AdminStatsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminGetStats()
      .then(res => setStats(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8 grid grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-white rounded-2xl animate-pulse" />)}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/admin" className="text-gray-400 hover:text-gray-600">←</Link>
          <h1 className="text-2xl font-bold text-gray-900">📊 Статистика</h1>
        </div>

        {/* Общие цифры */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { icon: '📦', label: 'Заказов', value: stats.totalOrders },
            { icon: '💰', label: 'Выручка', value: `${stats.totalRevenue} ₽` },
            { icon: '👥', label: 'Пользователей', value: stats.totalUsers },
            { icon: '🏪', label: 'Ресторанов', value: stats.totalRestaurants },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 text-center">
              <div className="text-3xl mb-2">{s.icon}</div>
              <p className="font-bold text-gray-900 text-xl">{s.value}</p>
              <p className="text-xs text-gray-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* По ресторанам */}
        <div className="bg-white rounded-2xl p-6 mb-4">
          <h2 className="font-bold text-gray-900 mb-4">🏪 По ресторанам</h2>
          <div className="flex flex-col gap-3">
            {stats.ordersByRestaurant.map((r: any, i: number) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <span className="text-gray-700 font-medium">{r.restaurant}</span>
                <div className="flex gap-6 text-sm text-gray-500">
                  <span>📦 {r.orders} заказов</span>
                  <span className="font-medium text-gray-900">💰 {r.revenue} ₽</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Последние заказы */}
        <div className="bg-white rounded-2xl p-6">
          <h2 className="font-bold text-gray-900 mb-4">📋 Последние заказы</h2>
          <div className="flex flex-col gap-3">
            {stats.recentOrders.map((o: any) => (
              <div key={o.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">{o.restaurantName}</p>
                  <p className="text-xs text-gray-400">{o.userEmail} • {new Date(o.createdAt).toLocaleDateString('ru-RU')}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{o.totalPrice} ₽</p>
                  <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-lg">{o.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}