import { useTranslation } from 'react-i18next'
import { ShopOutlined, RobotOutlined, ExclamationCircleOutlined } from '@ant-design/icons'

function MetricCard({ label, value, icon, colorClass, bgClass }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-500">{label}</span>
        <div className={`w-8 h-8 rounded-lg ${bgClass} ${colorClass} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
    </div>
  )
}

export default function DashboardMetrics({ restaurants }) {
  const { t } = useTranslation()

  const total = restaurants.length
  const configured = restaurants.filter((r) => r.bot_config).length
  const pending = total - configured

  return (
    <div className="grid grid-cols-3 gap-4 mb-7">
      <MetricCard
        label={t('dashboard.metrics.total')}
        value={total}
        icon={<ShopOutlined />}
        colorClass="text-emerald-600"
        bgClass="bg-emerald-50"
      />
      <MetricCard
        label={t('dashboard.metrics.configured')}
        value={configured}
        icon={<RobotOutlined />}
        colorClass="text-blue-600"
        bgClass="bg-blue-50"
      />
      <MetricCard
        label={t('dashboard.metrics.pending')}
        value={pending}
        icon={<ExclamationCircleOutlined />}
        colorClass="text-amber-600"
        bgClass="bg-amber-50"
      />
    </div>
  )
}
