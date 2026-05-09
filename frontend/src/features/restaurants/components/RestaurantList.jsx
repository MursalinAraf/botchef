import { Spin } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import RestaurantCard from './RestaurantCard'

export default function RestaurantList({ restaurants, isLoading, onEdit, onConfigure, onCreateNew }) {
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spin size="large" />
      </div>
    )
  }

  if (restaurants.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-3xl">
          🍽️
        </div>
        <h3 className="text-base font-medium text-gray-900">{t('dashboard.list.empty_title')}</h3>
        <p className="text-sm text-gray-400">{t('dashboard.list.empty_subtitle')}</p>
        <button
          onClick={onCreateNew}
          className="mt-2 flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <PlusOutlined />
          {t('dashboard.list.add_button')}
        </button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {restaurants.map((restaurant) => (
        <RestaurantCard
          key={restaurant.id}
          restaurant={restaurant}
          onEdit={onEdit}
          onConfigure={onConfigure}
        />
      ))}
    </div>
  )
}
