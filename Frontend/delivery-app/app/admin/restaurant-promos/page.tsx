'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { adminGetRestaurantPromos, adminToggleRestaurantPromo, adminCreateRestaurantPromo, adminGetRestaurants, getMenuItemsByRestaurant, adminUpdateRestaurantPromo, adminDeleteRestaurantPromo } from '@/lib/api';
import Link from 'next/link';

interface RestaurantPromo {
  id: number;
  title: string;
  description: string;
  type: number;
  minOrderAmount: number;
  isActive: boolean;
  restaurantId: number;
  restaurantName: string;
}

export default function AdminRestaurantPromosPage() {
  const [promos, setPromos] = useState<RestaurantPromo[]>([]);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [restaurantSearch, setRestaurantSearch] = useState('');
  const [formError, setFormError] = useState('');
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [menuItemSearch, setMenuItemSearch] = useState('');
  const [editingPromo, setEditingPromo] = useState<RestaurantPromo | null>(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', minOrderAmount: '' });
  const [form, setForm] = useState({
    restaurantId: '',
    title: '',
    description: '',
    type: '1',
    minOrderAmount: '',
    freeMenuItemId: '',
    buyQuantity: '',
    getQuantity: '',
    targetMenuItemId: '',
  });
  const [targetItemSearch, setTargetItemSearch] = useState('');

  const fetchAll = () => {
    Promise.all([adminGetRestaurantPromos(), adminGetRestaurants()])
      .then(([promosRes, restsRes]) => {
        setPromos(promosRes.data);
        setRestaurants(restsRes.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAll(); }, []);

  const handleToggle = async (id: number) => {
    await adminToggleRestaurantPromo(id);
    fetchAll();
  };

  useEffect(() => {
    if (!form.restaurantId) { setMenuItems([]); setMenuItemSearch(''); return; }
    getMenuItemsByRestaurant(parseInt(form.restaurantId))
      .then(res => setMenuItems(res.data))
      .catch(() => setMenuItems([]));
  }, [form.restaurantId]);

  const handleCreate = async () => {
    if (!form.restaurantId || !form.title || !form.minOrderAmount) {
      setFormError('Заполните обязательные поля');
      return;
    }
    setFormError('');
    try {
      await adminCreateRestaurantPromo({
        restaurantId: parseInt(form.restaurantId),
        title: form.title,
        description: form.description,
        type: parseInt(form.type),
        minOrderAmount: parseFloat(form.minOrderAmount),
        freeMenuItemId: form.freeMenuItemId ? parseInt(form.freeMenuItemId) : null,
        buyQuantity: form.buyQuantity ? parseInt(form.buyQuantity) : null,
        getQuantity: form.getQuantity ? parseInt(form.getQuantity) : null,
        isActive: true,
        targetMenuItemId: form.targetMenuItemId ? parseInt(form.targetMenuItemId) : null,
      });
      setShowForm(false);
      setForm({ restaurantId: '', title: '', description: '', type: '1', minOrderAmount: '', freeMenuItemId: '', buyQuantity: '', getQuantity: '', targetMenuItemId: '' });
      fetchAll();
    } catch {
      setFormError('Ошибка при создании акции');
    }
  };

  const handleEdit = (promo: RestaurantPromo) => {
    setEditingPromo(promo);
    setEditForm({
      title: promo.title,
      description: promo.description,
      minOrderAmount: promo.minOrderAmount.toString(),
    });
  };

  const handleUpdate = async () => {
    if (!editingPromo) return;
    try {
      await adminUpdateRestaurantPromo(editingPromo.id, {
        title: editForm.title,
        description: editForm.description,
        minOrderAmount: parseFloat(editForm.minOrderAmount),
      });
      setEditingPromo(null);
      fetchAll();
    } catch {
      console.error('Ошибка обновления акции');
    }
  };

  const handleDeletePromo = async (id: number) => {
    if (!confirm('Удалить акцию?')) return;
    try {
      await adminDeleteRestaurantPromo(id);
      fetchAll();
    } catch {
      console.error('Ошибка удаления акции');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-gray-400 hover:text-gray-600">←</Link>
            <h1 className="text-2xl font-bold text-gray-900">🔥 Акции ресторанов</h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-orange-600 transition"
          >
            + Добавить
          </button>
        </div>

        {/* Форма */}
        {showForm && (
          <div className="bg-white rounded-2xl p-6 mb-6">
            <h2 className="font-bold text-gray-900 mb-4">Новая акция</h2>
            <div className="flex flex-col gap-3">
              <div className="relative">
                <label className="block text-xs text-gray-500 mb-1">Ресторан *</label>
                <input
                  type="text"
                  value={restaurantSearch}
                  onChange={e => { setRestaurantSearch(e.target.value); setForm(p => ({ ...p, restaurantId: '' })); }}
                  placeholder="Начните вводить название..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
                {restaurantSearch && !form.restaurantId && (
                  <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-xl mt-1 shadow-lg max-h-40 overflow-y-auto">
                    {restaurants
                      .filter((r: any) => r.name.toLowerCase().includes(restaurantSearch.toLowerCase()))
                      .map((r: any) => (
                        <button
                          key={r.id}
                          onClick={() => { setForm(p => ({ ...p, restaurantId: r.id.toString() })); setRestaurantSearch(r.name); }}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-orange-50 text-gray-700"
                        >
                          {r.name}
                        </button>
                      ))
                    }
                    {restaurants.filter((r: any) => r.name.toLowerCase().includes(restaurantSearch.toLowerCase())).length === 0 && (
                      <p className="px-3 py-2 text-sm text-gray-400">Ничего не найдено</p>
                    )}
                  </div>
                )}
                {form.restaurantId && (
                  <p className="text-xs text-green-500 mt-1">✅ Выбран ресторан</p>
                )}
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">Тип акции *</label>
                <select
                  value={form.type}
                  onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                >
                  <option value="1">Бесплатный товар от суммы</option>
                  <option value="0">Купи N получи M</option>
                </select>
              </div>

              {[
                { label: 'Название акции *', field: 'title', placeholder: 'Тирамису в подарок' },
                { label: 'Описание', field: 'description', placeholder: 'При заказе от 1500 ₽...' },
                { label: 'Минимальная сумма (₽) *', field: 'minOrderAmount', placeholder: '1500' },
              ].map(({ label, field, placeholder }) => (
                <div key={field}>
                  <label className="block text-xs text-gray-500 mb-1">{label}</label>
                  <input
                    type="text"
                    value={form[field as keyof typeof form]}
                    onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                </div>
              ))}

              {form.type === '1' && (
                <div className="relative">
                  <label className="block text-xs text-gray-500 mb-1">Блюдо в подарок *</label>
                  {!form.restaurantId ? (
                    <p className="text-xs text-orange-400">Сначала выберите ресторан</p>
                  ) : (
                    <>
                      <input
                        type="text"
                        value={menuItemSearch}
                        onChange={e => { setMenuItemSearch(e.target.value); setForm(p => ({ ...p, freeMenuItemId: '' })); }}
                        placeholder="Начните вводить название блюда..."
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                      />
                      {menuItemSearch && !form.freeMenuItemId && (
                        <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-xl mt-1 shadow-lg max-h-40 overflow-y-auto">
                          {menuItems
                            .filter(m => m.name.toLowerCase().includes(menuItemSearch.toLowerCase()))
                            .map(m => (
                              <button
                                key={m.id}
                                onClick={() => {
                                  setForm(p => ({ ...p, freeMenuItemId: m.id.toString() }));
                                  setMenuItemSearch(`${m.name} (${m.price} ₽)`);
                                }}
                                className="w-full text-left px-3 py-2 text-sm hover:bg-orange-50 text-gray-700 flex justify-between"
                              >
                                <span>{m.name}</span>
                                <span className="text-gray-400">{m.price} ₽</span>
                              </button>
                            ))
                          }
                          {menuItems.filter(m => m.name.toLowerCase().includes(menuItemSearch.toLowerCase())).length === 0 && (
                            <p className="px-3 py-2 text-sm text-gray-400">Ничего не найдено</p>
                          )}
                        </div>
                      )}
                      {form.freeMenuItemId && (
                        <p className="text-xs text-green-500 mt-1">✅ Блюдо выбрано</p>
                      )}
                    </>
                  )}
                </div>
              )}

              {form.type === '0' && (
                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Купи N штук</label>
                      <input
                        type="text"
                        value={form.buyQuantity}
                        onChange={e => setForm(p => ({ ...p, buyQuantity: e.target.value }))}
                        placeholder="2"
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Получи M штук</label>
                      <input
                        type="text"
                        value={form.getQuantity}
                        onChange={e => setForm(p => ({ ...p, getQuantity: e.target.value }))}
                        placeholder="1"
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                      />
                    </div>
                  </div>

                  {/* Выбор блюда на которое действует акция */}
                  <div className="relative">
                    <label className="block text-xs text-gray-500 mb-1">Блюдо для акции *</label>
                    {!form.restaurantId ? (
                      <p className="text-xs text-orange-400">Сначала выберите ресторан</p>
                    ) : (
                      <>
                        <input
                          type="text"
                          value={targetItemSearch}
                          onChange={e => { setTargetItemSearch(e.target.value); setForm(p => ({ ...p, targetMenuItemId: '' })); }}
                          placeholder="Начните вводить название блюда..."
                          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                        />
                        {targetItemSearch && !form.targetMenuItemId && (
                          <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-xl mt-1 shadow-lg max-h-40 overflow-y-auto">
                            {menuItems
                              .filter(m => m.name.toLowerCase().includes(targetItemSearch.toLowerCase()))
                              .map(m => (
                                <button
                                  key={m.id}
                                  onClick={() => { setForm(p => ({ ...p, targetMenuItemId: m.id.toString() })); setTargetItemSearch(`${m.name} (${m.price} ₽)`); }}
                                  className="w-full text-left px-3 py-2 text-sm hover:bg-orange-50 text-gray-700 flex justify-between"
                                >
                                  <span>{m.name}</span>
                                  <span className="text-gray-400">{m.price} ₽</span>
                                </button>
                              ))}
                            {menuItems.filter(m => m.name.toLowerCase().includes(targetItemSearch.toLowerCase())).length === 0 && (
                              <p className="px-3 py-2 text-sm text-gray-400">Ничего не найдено</p>
                            )}
                          </div>
                        )}
                        {form.targetMenuItemId && <p className="text-xs text-green-500 mt-1">✅ Блюдо выбрано</p>}
                      </>
                    )}
                  </div>
                </div>
              )}
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

        {/* Список */}
        {loading ? (
          <div className="flex flex-col gap-3">
            {[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-white rounded-2xl animate-pulse" />)}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {promos.map(promo => (
              <div key={promo.id} className="bg-white rounded-2xl p-4 flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">{promo.title}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-lg font-medium ${
                      promo.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {promo.isActive ? 'Активна' : 'Отключена'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">{promo.description}</p>
                  <div className="flex gap-3 mt-1 text-xs text-gray-400">
                    <span>🏪 {promo.restaurantName}</span>
                    {promo.minOrderAmount > 0 && <span>От: {promo.minOrderAmount} ₽</span>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(promo)}
                    className="px-3 py-1.5 rounded-xl text-xs font-medium bg-orange-50 text-orange-500 hover:bg-orange-100 transition"
                  >✏️</button>
                  <button
                    onClick={() => handleToggle(promo.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                      promo.isActive
                        ? 'bg-red-50 text-red-500 hover:bg-red-100'
                        : 'bg-green-50 text-green-600 hover:bg-green-100'
                    }`}
                  >
                    {promo.isActive ? 'Откл' : 'Вкл'}
                  </button>
                  <button
                    onClick={() => handleDeletePromo(promo.id)}
                    className="px-3 py-1.5 rounded-xl text-xs font-medium bg-gray-100 text-gray-500 hover:bg-gray-200 transition"
                  >🗑️</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Модал редактирования акции */}
        {editingPromo && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4">
              <h3 className="font-bold text-lg text-gray-900 mb-4">✏️ Редактировать акцию</h3>
              <div className="flex flex-col gap-3">
                {[
                  { label: 'Название', field: 'title', placeholder: 'Тирамису в подарок' },
                  { label: 'Описание', field: 'description', placeholder: 'При заказе от...' },
                  { label: 'Мин. сумма (₽)', field: 'minOrderAmount', placeholder: '1500' },
                ].map(({ label, field, placeholder }) => (
                  <div key={field}>
                    <label className="block text-xs text-gray-500 mb-1">{label}</label>
                    <input
                      type="text"
                      value={editForm[field as keyof typeof editForm]}
                      onChange={e => setEditForm(p => ({ ...p, [field]: e.target.value }))}
                      placeholder={placeholder}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setEditingPromo(null)}
                  className="flex-1 border border-gray-200 rounded-xl py-2 text-sm hover:bg-gray-50"
                >Отмена</button>
                <button
                  onClick={handleUpdate}
                  className="flex-1 bg-orange-500 text-white rounded-xl py-2 text-sm hover:bg-orange-600"
                >Сохранить</button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}