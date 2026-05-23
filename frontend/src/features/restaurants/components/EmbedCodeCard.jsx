import { useState } from 'react'
import { Button } from 'antd'
import { CopyOutlined, CheckOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'

export default function EmbedCodeCard({ restaurant }) {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)

  const origin = window.location.origin
  const embedCode =
    `<script src="${origin}/widget.js" data-bot-token="${restaurant.public_token}" data-api-url="${origin}"></script>`

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => {
      const ta = document.createElement('textarea')
      ta.value = embedCode
      ta.style.cssText = 'position:fixed;opacity:0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="mt-3 rounded-lg border border-gray-100 bg-gray-50 p-3">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-medium text-gray-600">{t('dashboard.card.embed_title')}</p>
        <Button
          size="small"
          icon={copied ? <CheckOutlined /> : <CopyOutlined />}
          onClick={handleCopy}
          type={copied ? 'primary' : 'default'}
        >
          {copied ? t('dashboard.card.embed_copied') : t('dashboard.card.embed_copy')}
        </Button>
      </div>
      <p className="text-xs text-gray-400 mb-2">
        {t('dashboard.card.embed_before_tag')}{' '}
        <code className="bg-gray-200 px-1 rounded">&lt;/body&gt;</code>
        {' '}{t('dashboard.card.embed_after_tag')}
      </p>
      <div className="bg-white rounded border border-gray-200 p-2 font-mono text-[11px] text-gray-600 break-all leading-relaxed">
        {embedCode}
      </div>
    </div>
  )
}
