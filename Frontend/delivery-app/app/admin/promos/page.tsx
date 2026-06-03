'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { adminGetPromos, adminCreatePromo, adminTogglePromo, adminDeletePromo } from '@/lib/api';
import Link from 'next/link';

interface Promo {
  id: number;
  code: string;
  description: string;
  discountPercent: number;
  minOrderAmount: number;
  expiresAt: string;
  isActive: boolean;
  usedCount: number;
}

export default function AdminPromosPage() {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    code: '', description: '', discountPercent: '',
    minOrderAmount: '', expiresAt: ''
  });
  const [formError, setFormError] = useState('');

  const fetchPromos = () => {
    adminGetPromos()
      .then(res => setPromos(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPromos(); }, []);

  const handleCreate = async () => {
    if (!form.code || !form.discountPercent || !form.expiresAt) {
      setFormError('Заполните обязательные поля');
      return;
    }
    try {
      await adminCreatePromo({
        code: form.code.toUpperCase(),
        description: form.description,
        discountPercent: parseFloat(form.discountPercent),
        minOrderAmount: parseFloat(form.minOrderAmount) || 0,
        expiresAt: new Date(form.expiresAt).toISOString(),
        isActive: true,
        type: 0
      });
      setForm({ code: '', description: '', discountPercent: '', minOrderAmount: '', expiresAt: '' });
      setShowForm(false);
      fetchPromos();
    } catch {
      setFormError('Ошибка при создании промокода');
    }
  };

  const handleToggle = async (id: number) => {
    await adminTogglePromo(id);
    fetchPromos();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить промокод?')) return;
    await adminDeletePromo(id);
    fetchPromos();
  };

  const isExpired = (date: string) => new Date(date) < new Date();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-gray-400 hover:text-gray-600">←</Link>
            <h1 className="text-2xl font-bold text-gray-900">🎟️ Промокоды</h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-orange-600 transition"
          >
            + Добавить
          </button>
        </div>

        {/* Форма создания */}
        {showForm && (
          <div className="bg-white rounded-2xl p-6 mb-6">
            <h2 className="font-bold text-gray-900 mb-4">Новый промокод</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Код *', field: 'code', placeholder: 'FOOD20' },
                { label: 'Скидка % *', field: 'discountPercent', placeholder: '20' },
                { label: 'Мин. сумма (₽)', field: 'minOrderAmount', placeholder: '0' },
                { label: 'Действует до *', field: 'expiresAt', placeholder: '', type: 'date' },
              ].map(({ label, field, placeholder, type }) => (
                <div key={field}>
                  <label className="block text-xs text-gray-500 mb-1">{label}</label>
                  <input
                    type={type || 'text'}
                    value={form[field as keyof typeof form]}
                    onChange={e => setForm(prev => ({ ...prev, [field]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                </div>
              ))}
              <div className="col-span-2">
                <label className="block text-xs text-gray-500 mb-1">Описание</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Скидка 20% на первый заказ"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
              </div>
            </div>
            {formError && <p className="text-red-500 text-xs mt-2">{formError}</p>}
            <div className="flex gap-3 mt-4">
              <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 rounded-xl py-2 text-sm hover:bg-gray-50">
                Отмена
              </button>
              <button onClick={handleCreate} className="flex-1 bg-orange-500 text-white rounded-xl py-2 text-sm hover:bg-orange-600">
                Создать
              </button>
            </div>
          </div>
        )}

        {/* Список промокодов */}
        {loading ? (
          <div className="flex flex-col gap-3">
            {[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-white rounded-2xl animate-pulse" />)}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {promos.map(promo => {
              const expired = isExpired(promo.expiresAt);
              return (
                <div key={promo.id} className="bg-white rounded-2xl p-4 flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-gray-900">{promo.code}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-lg font-medium ${
                        expired ? 'bg-gray-100 text-gray-400' :
                        promo.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'
                      }`}>
                        {expired ? 'Истёк' : promo.isActive ? 'Активен' : 'Отключён'}
                      </span>
                      <span className="text-xs text-gray-400">использован {promo.usedCount} раз</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">{promo.description}</p>
                    <div className="flex gap-3 mt-1 text-xs text-gray-400">
                      <span>Скидка: {promo.discountPercent}%</span>
                      {promo.minOrderAmount > 0 && <span>От: {promo.minOrderAmount} ₽</span>}
                      <span>До: {new Date(promo.expiresAt).toLocaleDateString('ru-RU')}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!expired && (
                      <button
                        onClick={() => handleToggle(promo.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                          promo.isActive
                            ? 'bg-red-50 text-red-500 hover:bg-red-100'
                            : 'bg-green-50 text-green-600 hover:bg-green-100'
                        }`}
                      >
                        {promo.isActive ? 'Отключить' : 'Включить'}
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(promo.id)}
                      className="px-3 py-1.5 rounded-xl text-xs font-medium bg-gray-100 text-gray-500 hover:bg-gray-200 transition"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}