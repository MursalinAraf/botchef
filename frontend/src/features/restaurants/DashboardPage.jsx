import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Button } from 'antd'
import { ShopOutlined, PlusOutlined, LogoutOutlined, UserAddOutlined } from '@ant-design/icons'
import { selectCurrentUser, clearCredentials } from 'features/auth/authSlice'
import { useLogoutMutation } from 'features/auth/authApi'
import LanguageSwitcher from 'components/LanguageSwitcher'
import { useGetRestaurantsQuery } from './restaurantsApi'
import DashboardMetrics from './components/DashboardMetrics'
import RestaurantList from './components/RestaurantList'
import CreateRestaurantModal from './components/CreateRestaurantModal'
import BotConfigForm from './components/BotConfigForm'
import InviteUserModal from 'features/invitations/components/InviteUserModal'
import ChatWidget from 'features/chat/components/ChatWidget'

export default function DashboardPage() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const user = useSelector(selectCurrentUser)
  const [logout] = useLogoutMutation()
  const [createModal, setCreateModal] = useState({ open: false, restaurant: null })
  const [botConfigDrawer, setBotConfigDrawer] = useState({ open: false, restaurant: null })
  const [inviteModal, setInviteModal] = useState(false)
  const [previewBot, setPreviewBot] = useState(null)

  const { data: restaurants = [], isLoading } = useGetRestaurantsQuery()

  const handleLogout = async () => {
    try {
      await logout().unwrap()
    } finally {
      dispatch(clearCredentials())
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-60 bg-white border-r border-gray-100 flex-shrink-0 flex flex-col">
        <div className="flex items-center gap-2.5 px-5 h-16 border-b border-gray-100">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-base"
            style={{ background: '#059669' }}
          >
            🍕
          </div>
          <span className="font-semibold text-gray-900 text-[15px]">BotChef</span>
        </div>

        <nav className="flex-1 p-3 pt-4">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-emerald-50 text-emerald-700 text-sm font-medium">
            <ShopOutlined />
            {t('dashboard.nav.restaurants')}
          </div>
        </nav>

        <div className="border-t border-gray-100 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-sm font-semibold text-emerald-700 flex-shrink-0">
              {user?.first_name?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
          <div className="mb-2">
            <LanguageSwitcher />
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 w-full px-2 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
          >
            <LogoutOutlined />
            {t('dashboard.nav.sign_out')}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="px-8 py-7 max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-7">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{t('dashboard.header.title')}</h1>
              <p className="text-sm text-gray-400 mt-0.5">{t('dashboard.header.subtitle')}</p>
            </div>
            <div className="flex gap-2">
              {user?.role === 'admin' && (
                <Button
                  icon={<UserAddOutlined />}
                  onClick={() => setInviteModal(true)}
                >
                  {t('dashboard.header.invite_admin')}
                </Button>
              )}
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setCreateModal({ open: true, restaurant: null })}
              >
                {t('dashboard.header.new_restaurant')}
              </Button>
            </div>
          </div>

          <DashboardMetrics restaurants={restaurants} />

          <RestaurantList
            restaurants={restaurants}
            isLoading={isLoading}
            onEdit={(r) => setCreateModal({ open: true, restaurant: r })}
            onConfigure={(r) => setBotConfigDrawer({ open: true, restaurant: r })}
            onCreateNew={() => setCreateModal({ open: true, restaurant: null })}
            onPreview={(r) => setPreviewBot(r)}
          />
        </div>
      </main>

      <CreateRestaurantModal
        open={createModal.open}
        restaurant={createModal.restaurant}
        onClose={() => setCreateModal({ open: false, restaurant: null })}
      />

      <BotConfigForm
        open={botConfigDrawer.open}
        restaurant={botConfigDrawer.restaurant}
        onClose={() => setBotConfigDrawer({ open: false, restaurant: null })}
      />

      <InviteUserModal
        open={inviteModal}
        onClose={() => setInviteModal(false)}
      />

      {previewBot && (
        <ChatWidget
          restaurant={previewBot}
          botConfig={previewBot.bot_config}
        />
      )}
    </div>
  )
}
