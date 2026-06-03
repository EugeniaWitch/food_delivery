'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { adminUpdateMenuItem } from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';
import AuthGuard from '@/components/AuthGuard';
import api from '@/lib/api';

export default function EditMenuItemPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '', description: '', price: '',
    imageUrl: '', category: ''
  });

  useEffect(() => {
    api.get(`/admin/menu/${id}`)
      .then(res => {
        const item = res.data;
        setForm({
          name: item.name,
          description: item.description,
          price: item.price.toString(),
          imageUrl: item.imageUrl,
          category: item.category
        });
      })
      .catch(() => router.back())
      .finally(() => setFetching(false));
  }, [id]);

  const handleSubmit = async () => {
    if (!form.name || !form.price) {
      setError('Заполните название и цену');
      return;
    }
    setLoading(true);
    try {
      await adminUpdateMenuItem(Number(id), {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        imageUrl: form.imageUrl,
        category: form.category,
        isAvailable: true,
      });
      router.back();
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
            <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-600">←</button>
            <h1 className="text-2xl font-bold text-gray-900">✏️ Редактировать блюдо</h1>
          </div>

          <div className="bg-white rounded-2xl p-6">
            <div className="flex flex-col gap-3">
              {[
                { label: 'Название *', field: 'name', placeholder: 'Пицца Маргарита' },
                { label: 'Описание', field: 'description', placeholder: 'Томат, моцарелла, базилик' },
                { label: 'Цена (₽) *', field: 'price', placeholder: '590' },
                { label: 'URL фото', field: 'imageUrl', placeholder: 'https://...' },
                { label: 'Категория', field: 'category', placeholder: 'Пицца' },
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
            </div>

            {error && <div className="bg-red-50 text-red-500 text-sm px-4 py-3 rounded-xl mt-4">{error}</div>}

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => router.back()}
                className="flex-1 border border-gray-200 py-3 rounded-xl text-sm hover:bg-gray-50"
              >
                Отмена
              </button>
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
      </div>
    </AuthGuard>
  );
}