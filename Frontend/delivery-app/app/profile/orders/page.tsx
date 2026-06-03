'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { getMyOrders } from '@/lib/api';
import { Order } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function OrdersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    getMyOrders()
      .then(res => setOrders(res.data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-8">

        <div className="flex items-center gap-3 mb-6">
          <Link href="/profile" className="text-gray-400 hover:text-gray-600">←</Link>
          <h1 className="text-2xl font-bold text-gray-900">📦 История заказов</h1>
        </div>

        {loading ? (
          <div className="flex flex-col gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-white rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-gray-500 text-lg">Заказов пока нет</p>
            <Link
              href="/"
              className="mt-6 inline-block bg-orange-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-orange-600 transition"
            >
              Сделать первый заказ
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-bold text-gray-900">{order.restaurantName}</p>
                    <p className="text-sm text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString('ru-RU', {
                        day: 'numeric', month: 'long', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <span className="bg-green-100 text-green-600 text-xs font-medium px-3 py-1 rounded-xl">
                    ✅ {order.status}
                  </span>
                </div>

                <div className="border-t border-gray-100 pt-3 mb-3">
                  {order.items.filter(i => i.price > 0).map((item, i) => (
                    <div key={i} className="flex justify-between text-sm py-1">
                      <span className="text-gray-600">{item.menuItemName} × {item.quantity}</span>
                      <span className="text-gray-900 font-medium">{item.price * item.quantity} ₽</span>
                    </div>
                  ))}
                  {order.items.filter(i => i.price === 0).map((item, i) => (
                    <div key={i} className="flex justify-between text-sm py-1">
                      <span className="text-green-600">🎁 {item.menuItemName} × {item.quantity}</span>
                      <span className="text-green-500 font-medium">0 ₽</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">📍 {order.deliveryAddress}</span>
                  <span className="font-bold text-gray-900">{order.totalPrice} ₽</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}