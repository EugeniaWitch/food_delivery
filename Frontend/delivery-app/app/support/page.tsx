import Header from '@/components/Header';
import Link from 'next/link';

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-8">

        <div className="flex items-center gap-3 mb-6">
          <Link href="/" className="text-gray-400 hover:text-gray-600">←</Link>
          <h1 className="text-2xl font-bold text-gray-900">💬 Поддержка</h1>
        </div>

        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-2xl p-6">
            <h2 className="font-bold text-lg text-gray-900 mb-4">Свяжитесь с нами</h2>
            <div className="flex flex-col gap-3">
              <a href="mailto:support@fooddelivery.ru"
                className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl hover:bg-orange-100 transition">
                <span className="text-2xl">📧</span>
                <div>
                  <p className="font-medium text-gray-900">Email</p>
                  <p className="text-sm text-orange-500">support@fooddelivery.ru</p>
                </div>
              </a>
              <a href="tel:+78001234567"
                className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl hover:bg-orange-100 transition">
                <span className="text-2xl">📞</span>
                <div>
                  <p className="font-medium text-gray-900">Телефон</p>
                  <p className="text-sm text-orange-500">8 800 123-45-67 (бесплатно)</p>
                </div>
              </a>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6">
            <h2 className="font-bold text-lg text-gray-900 mb-4">Частые вопросы</h2>
            <div className="flex flex-col gap-3">
              {[
                { q: 'Как отследить заказ?', a: 'После оформления заказ появится в истории заказов в вашем профиле.' },
                { q: 'Можно ли отменить заказ?', a: 'Отмена возможна в течение 5 минут после оформления через поддержку.' },
                { q: 'Какие способы оплаты доступны?', a: 'Оплата картой онлайн при оформлении заказа.' },
                { q: 'Как долго доставляют?', a: 'Среднее время доставки указано на карточке каждого ресторана.' },
              ].map((item, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-4">
                  <p className="font-medium text-gray-900 mb-1">❓ {item.q}</p>
                  <p className="text-sm text-gray-500">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}