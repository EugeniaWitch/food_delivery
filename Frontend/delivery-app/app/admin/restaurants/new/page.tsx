'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import { adminCreateRestaurant, adminCreateMenuItem } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CUISINES, CATEGORIES } from '@/lib/constants';
import AuthGuard from '@/components/AuthGuard';

interface NewMenuItem {
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  category: string;
}

export default function NewRestaurantPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '', imageUrl: '', rating: '', deliveryTimeMin: '',
    deliveryTimeMax: '', cuisine: '', category: '',
    category2: '', category3: ''
  });

  const [menuItems, setMenuItems] = useState<NewMenuItem[]>([
    { name: '', description: '', price: '', imageUrl: '', category: '' }
  ]);

  const handleSubmit = async () => {
    if (!form.name || !form.cuisine || !form.category) {
      setError('Заполните все обязательные поля');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await adminCreateRestaurant({
        name: form.name,
        imageUrl: form.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
        rating: parseFloat(form.rating) || 4.0,
        deliveryTimeMin: parseInt(form.deliveryTimeMin) || 20,
        deliveryTimeMax: parseInt(form.deliveryTimeMax) || 40,
        cuisine: form.cuisine,
        category: form.category,
        category2: form.category2 || null,
        category3: form.category3 || null,
      });

      const restaurantId = res.data.id;
      for (const item of menuItems) {
        if (item.name && item.price) {
          await adminCreateMenuItem(restaurantId, {
            name: item.name,
            description: item.description,
            price: parseFloat(item.price),
            imageUrl: item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300',
            category: item.category || form.category,
            isAvailable: true
          });
        }
      }
      router.push('/');
    } catch {
      setError('Ошибка при создании ресторана');
    } finally {
      setLoading(false);
    }
  };

  const addMenuItem = () =>
    setMenuItems(prev => [...prev, { name: '', description: '', price: '', imageUrl: '', category: '' }]);

  const updateMenuItem = (idx: number, field: keyof NewMenuItem, value: string) =>
    setMenuItems(prev => prev.map((item, i) => i === idx ? { ...item, [field]: value } : item));

  const removeMenuItem = (idx: number) =>
    setMenuItems(prev => prev.filter((_, i) => i !== idx));

  const SelectField = ({ label, field, options, required }: { label: string, field: string, options: string[], required?: boolean }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}{required && ' *'}</label>
      <select
        value={form[field as keyof typeof form] as string}
        onChange={e => setForm(prev => ({ ...prev, [field]: e.target.value }))}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
      >
        <option value="">Выберите...</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );

  return (
    <AuthGuard requireAdmin>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-6">
            <Link href="/" className="text-gray-400 hover:text-gray-600">←</Link>
            <h1 className="text-2xl font-bold text-gray-900">+ Новый ресторан</h1>
          </div>

          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-2xl p-6">
              <h2 className="font-bold text-gray-900 mb-4">Основная информация</h2>
              <div className="flex flex-col gap-3">
                {[
                  { label: 'Название', field: 'name', placeholder: 'Название заведения', required: true },
                  { label: 'URL фото', field: 'imageUrl', placeholder: 'https://...' },
                  { label: 'Рейтинг (0-5)', field: 'rating', placeholder: '4.5' },
                  { label: 'Мин. время доставки (мин)', field: 'deliveryTimeMin', placeholder: '20' },
                  { label: 'Макс. время доставки (мин)', field: 'deliveryTimeMax', placeholder: '40' },
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

                <SelectField label="Кухня" field="cuisine" options={CUISINES} required />
                <SelectField label="Категория 1" field="category" options={CATEGORIES} required />
                <SelectField label="Категория 2 (необязательно)" field="category2" options={CATEGORIES} />
                <SelectField label="Категория 3 (необязательно)" field="category3" options={CATEGORIES} />

              </div>
            </div>

            <div className="bg-white rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-900">Блюда в меню</h2>
                <button onClick={addMenuItem} className="text-orange-500 text-sm hover:underline font-medium">
                  + Добавить блюдо
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {menuItems.map((item, idx) => (
                  <div key={idx} className="border border-gray-100 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-500">Блюдо {idx + 1}</span>
                      {menuItems.length > 1 && (
                        <button onClick={() => removeMenuItem(idx)} className="text-red-400 text-sm hover:underline">Удалить</button>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      {[
                        { label: 'Название', field: 'name', placeholder: 'Пицца Маргарита' },
                        { label: 'Описание', field: 'description', placeholder: 'Томат, моцарелла...' },
                        { label: 'Цена (₽)', field: 'price', placeholder: '590' },
                        { label: 'URL фото', field: 'imageUrl', placeholder: 'https://...' },
                      ].map(({ label, field, placeholder }) => (
                        <div key={field}>
                          <label className="block text-xs text-gray-500 mb-1">{label}</label>
                          <input
                            type="text"
                            value={item[field as keyof NewMenuItem]}
                            onChange={e => updateMenuItem(idx, field as keyof NewMenuItem, e.target.value)}
                            placeholder={placeholder}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                          />
                        </div>
                      ))}
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Категория</label>
                        <select
                          value={item.category}
                          onChange={e => updateMenuItem(idx, 'category', e.target.value)}
                          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                        >
                          <option value="">Выберите категорию...</option>
                          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {error && <div className="bg-red-50 text-red-500 text-sm px-4 py-3 rounded-xl">{error}</div>}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition disabled:opacity-50"
            >
              {loading ? 'Создаём...' : 'Создать ресторан'}
            </button>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}