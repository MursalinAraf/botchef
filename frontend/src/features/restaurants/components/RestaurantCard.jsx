import { useState } from 'react'
import { Button, Tag, Popconfirm } from 'antd'
import {
  EditOutlined,
  SettingOutlined,
  DeleteOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  ClockCircleOutlined,
  RobotOutlined,
  CodeOutlined,
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useDeleteRestaurantMutation } from '../restaurantsApi'
import EmbedCodeCard from './EmbedCodeCard'

export default function RestaurantCard({ restaurant, onEdit, onConfigure, onPreview }) {
  const { t } = useTranslation()
  const [deleteRestaurant, { isLoading: isDeleting }] = useDeleteRestaurantMutation()
  const [showEmbed, setShowEmbed] = useState(false)

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden flex flex-col">
      <div className="p-5 flex-1">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-semibold text-gray-900 text-base leading-tight">{restaurant.name}</h3>
          <Tag color={restaurant.bot_config ? 'success' : 'default'} className="flex-shrink-0 mt-0.5">
            {restaurant.bot_config ? t('dashboard.card.bot_active') : t('dashboard.card.no_bot')}
          </Tag>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <EnvironmentOutlined className="text-gray-400 flex-shrink-0" />
            <span className="truncate">{restaurant.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <PhoneOutlined className="text-gray-400 flex-shrink-0" />
            <span>{restaurant.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <ClockCircleOutlined className="text-gray-400 flex-shrink-0" />
            <span className="truncate">{restaurant.opening_hours}</span>
          </div>
        </div>
      </div>

      <div className="px-5 py-3 border-t border-gray-50 flex items-center gap-2">
        <Button
          type="primary"
          ghost
          size="small"
          icon={<SettingOutlined />}
          onClick={() => onConfigure(restaurant)}
          className="flex-1"
        >
          {t('dashboard.card.configure_bot')}
        </Button>
        {restaurant.bot_config && (
          <Button
            size="small"
            icon={<RobotOutlined />}
            onClick={() => onPreview(restaurant)}
            title="Preview chatbot"
          />
        )}
        {restaurant.bot_config && (
          <Button
            size="small"
            icon={<CodeOutlined />}
            onClick={() => setShowEmbed((prev) => !prev)}
            title="Get embed code"
            type={showEmbed ? 'primary' : 'default'}
          />
        )}
        <Button size="small" icon={<EditOutlined />} onClick={() => onEdit(restaurant)} />
        <Popconfirm
          title={t('dashboard.card.delete_title')}
          description={t('dashboard.card.delete_description')}
          onConfirm={() => deleteRestaurant(restaurant.id)}
          okText={t('dashboard.card.delete_confirm')}
          okButtonProps={{ danger: true }}
          cancelText={t('common.cancel')}
        >
          <Button size="small" icon={<DeleteOutlined />} danger loading={isDeleting} />
        </Popconfirm>
      </div>

      {restaurant.bot_config && showEmbed && (
        <div className="px-5 pb-4">
          <EmbedCodeCard restaurant={restaurant} />
        </div>
      )}
    </div>
  )
}
