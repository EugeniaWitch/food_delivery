import Header from '@/components/Header';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-8">

        <div className="flex items-center gap-3 mb-6">
          <Link href="/profile" className="text-gray-400 hover:text-gray-600">←</Link>
          <h1 className="text-2xl font-bold text-gray-900">ℹ️ О сервисе</h1>
        </div>

        <div className="flex flex-col gap-4">
          <div className="bg-gradient-to-r from-orange-500 to-orange-400 rounded-2xl p-8 text-white text-center">
            <div className="text-6xl mb-4">🍕</div>
            <h2 className="text-2xl font-bold">FoodDelivery</h2>
            <p className="text-orange-100 mt-2">Быстрая доставка из лучших ресторанов</p>
          </div>

          <div className="bg-white rounded-2xl p-6">
            <h2 className="font-bold text-lg text-gray-900 mb-3">О нас</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              FoodDelivery — сервис быстрой доставки еды из лучших ресторанов вашего города.
              Мы работаем с 2024 года и доставляем тысячи заказов каждый день.
              Наша миссия — привозить вкусную еду быстро и в лучшем виде.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: '🏪', value: '50+', label: 'Ресторанов' },
              { icon: '🚀', value: '30 мин', label: 'Среднее время' },
              { icon: '⭐', value: '4.8', label: 'Рейтинг' },
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 text-center">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <p className="font-bold text-gray-900 text-lg">{stat.value}</p>
                <p className="text-xs text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-6">
            <h2 className="font-bold text-lg text-gray-900 mb-3">Версия приложения</h2>
            <p className="text-sm text-gray-400">FoodDelivery v1.0.0</p>
          </div>
        </div>
      </div>
    </div>
  );
}