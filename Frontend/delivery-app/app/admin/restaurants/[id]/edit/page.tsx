'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { adminUpdateRestaurant, getRestaurant } from '@/lib/api';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { CUISINES, CATEGORIES } from '@/lib/constants';
import AuthGuard from '@/components/AuthGuard';

export default function EditRestaurantPage() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '', imageUrl: '', rating: '', deliveryTimeMin: '',
    deliveryTimeMax: '', cuisine: '', category: '',
    category2: '', category3: ''
  });

  useEffect(() => {
    getRestaurant(Number(id))
      .then(res => {
        const r = res.data;
        setForm({
          name: r.name, imageUrl: r.imageUrl,
          rating: r.rating.toString(),
          deliveryTimeMin: r.deliveryTimeMin.toString(),
          deliveryTimeMax: r.deliveryTimeMax.toString(),
          cuisine: r.cuisine, category: r.category,
          category2: r.category2 || '',
          category3: r.category3 || ''
        });
      })
      .finally(() => setFetching(false));
  }, [id]);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      await adminUpdateRestaurant(Number(id), {
        name: form.name, imageUrl: form.imageUrl,
        rating: parseFloat(form.rating),
        deliveryTimeMin: parseInt(form.deliveryTimeMin),
        deliveryTimeMax: parseInt(form.deliveryTimeMax),
        cuisine: form.cuisine, category: form.category,
        category2: form.category2 || null,
        category3: form.category3 || null
      });
      router.push('/');
    } catch {
      setError('Ошибка при сохранении');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <AuthGuard requireAdmin>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-orange-500 text-4xl animate-pulse">🍕</div>
      </div>
    </AuthGuard>
  );

  return (
    <AuthGuard requireAdmin>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-6">
            <Link href="/" className="text-gray-400 hover:text-gray-600">←</Link>
            <h1 className="text-2xl font-bold text-gray-900">✏️ Редактировать ресторан</h1>
          </div>

          <div className="bg-white rounded-2xl p-6">
            <div className="flex flex-col gap-3">
              {[
                { label: 'Название', field: 'name', placeholder: 'Название заведения' },
                { label: 'URL фото', field: 'imageUrl', placeholder: 'https://...' },
                { label: 'Рейтинг', field: 'rating', placeholder: '4.5' },
                { label: 'Мин. время доставки', field: 'deliveryTimeMin', placeholder: '20' },
                { label: 'Макс. время доставки', field: 'deliveryTimeMax', placeholder: '40' },
              ].map(({ label, field, placeholder }) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input
                    type="text"
                    value={form[field as keyof typeof form] as string}
                    onChange={e => setForm(prev => ({ ...prev, [field]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                </div>
              ))}

              {[
                { label: 'Кухня', field: 'cuisine', options: CUISINES },
                { label: 'Категория 1', field: 'category', options: CATEGORIES },
                { label: 'Категория 2 (необязательно)', field: 'category2', options: CATEGORIES },
                { label: 'Категория 3 (необязательно)', field: 'category3', options: CATEGORIES },
              ].map(({ label, field, options }) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <select
                    value={form[field as keyof typeof form] as string}
                    onChange={e => setForm(prev => ({ ...prev, [field]: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                  >
                    <option value="">Выберите...</option>
                    {options.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              ))}

            </div>
          </div>

          {error && <div className="bg-red-50 text-red-500 text-sm px-4 py-3 rounded-xl mt-4">{error}</div>}

          <div className="flex gap-3 mt-4">
            <Link href="/" className="flex-1 text-center border border-gray-200 py-3 rounded-xl text-sm hover:bg-gray-50">
              Отмена
            </Link>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-medium hover:bg-orange-600 disabled:opacity-50"
            >
              {loading ? 'Сохраняем...' : 'Сохранить'}
            </button>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}