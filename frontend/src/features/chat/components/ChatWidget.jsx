import { useState } from 'react'
import useChatMessages from '../useChatMessages'
import DancingMascot from './DancingMascot'
import ChatWindow from './ChatWindow'
import '../chat.css'

export default function ChatWidget({ restaurant, botConfig }) {
  const brandColor = botConfig?.brand_color ?? '#059669'
  const [isOpen, setIsOpen] = useState(false)
  const [rippling, setRippling] = useState(false)
  const { messages, sendMessage, isLoading, error } = useChatMessages(restaurant?.id)

  const handleButtonClick = () => {
    setRippling(true)
    setTimeout(() => setRippling(false), 500)
    setIsOpen((prev) => !prev)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat window */}
      {isOpen && (
        <ChatWindow
          restaurant={restaurant}
          botConfig={botConfig}
          brandColor={brandColor}
          messages={messages}
          isLoading={isLoading}
          onSend={sendMessage}
          onClose={() => setIsOpen(false)}
          error={error}
        />
      )}

      {/* Dancing mascot — only when chat is closed */}
      {!isOpen && restaurant && botConfig && (
        <DancingMascot
          mascotType={botConfig.mascot_type ?? 'pizza'}
          isOpen={isOpen}
          onClick={handleButtonClick}
        />
      )}

      {/* Floating action button */}
      <button
        onClick={handleButtonClick}
        className="relative w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl overflow-hidden transition-transform hover:scale-105 active:scale-95 focus:outline-none"
        style={{ backgroundColor: brandColor }}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {/* Pulse rings (only when closed) */}
        {!isOpen && (
          <>
            <span className="pulse-ring absolute inset-0 rounded-full pointer-events-none" style={{ backgroundColor: brandColor }} />
            <span className="pulse-ring-delayed absolute inset-0 rounded-full pointer-events-none" style={{ backgroundColor: brandColor }} />
          </>
        )}

        {/* Ripple on click */}
        {rippling && (
          <span className="ripple-effect absolute inset-0 rounded-full bg-white/40 pointer-events-none" />
        )}

        {isOpen ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
          </svg>
        )}
      </button>
    </div>
  )
}
