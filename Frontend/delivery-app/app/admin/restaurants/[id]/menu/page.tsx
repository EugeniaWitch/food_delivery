'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import { adminCreateMenuItem } from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CATEGORIES } from '@/lib/constants';
import AuthGuard from '@/components/AuthGuard';

export default function AddMenuItemPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '', description: '', price: '',
    imageUrl: '', category: ''
  });

  const handleSubmit = async () => {
    if (!form.name || !form.price) {
      setError('Заполните название и цену');
      return;
    }
    setLoading(true);
    try {
      await adminCreateMenuItem(Number(id), {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        imageUrl: form.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300',
        category: form.category
      });
      router.push(`/restaurant/${id}`);
    } catch {
      setError('Ошибка при добавлении блюда');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthGuard requireAdmin>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-6">
            <Link href={`/restaurant/${id}`} className="text-gray-400 hover:text-gray-600">←</Link>
            <h1 className="text-2xl font-bold text-gray-900">+ Новое блюдо</h1>
          </div>

          <div className="bg-white rounded-2xl p-6">
            <div className="flex flex-col gap-3">

              {/* Текстовые поля */}
              {[
                { label: 'Название *', field: 'name', placeholder: 'Пицца Маргарита' },
                { label: 'Описание', field: 'description', placeholder: 'Томат, моцарелла, базилик' },
                { label: 'Цена (₽) *', field: 'price', placeholder: '590' },
                { label: 'URL фото', field: 'imageUrl', placeholder: 'https://...' },
              ].map(({ label, field, placeholder }) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input
                    type="text"
                    value={form[field as keyof typeof form] as string}
                    onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                </div>
              ))}

              {/* Категория — выпадающий список */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Категория</label>
                <select
                  value={form.category}
                  onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                >
                  <option value="">Выберите категорию...</option>
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

            </div>

            {error && <div className="bg-red-50 text-red-500 text-sm px-4 py-3 rounded-xl mt-4">{error}</div>}

            <div className="flex gap-3 mt-6">
              <Link
                href={`/restaurant/${id}`}
                className="flex-1 text-center border border-gray-200 py-3 rounded-xl text-sm hover:bg-gray-50"
              >
                Отмена
              </Link>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-medium hover:bg-orange-600 disabled:opacity-50"
              >
                {loading ? 'Добавляем...' : 'Добавить блюдо'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}