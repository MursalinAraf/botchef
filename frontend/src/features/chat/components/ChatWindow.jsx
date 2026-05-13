import { useState, useRef, useEffect } from 'react'
import { MASCOT_CONFIG } from 'utils/botConfig'
import '../chat.css'

const QUICK_REPLIES = [
  'See the menu 🍽️',
  'Opening hours ⏰',
  'Delivery info 🚚',
  'Current deals 🎉',
]

const formatTime = (date) =>
  new Intl.DateTimeFormat('en', { hour: '2-digit', minute: '2-digit', hour12: true }).format(date)

export default function ChatWindow({ restaurant, botConfig, brandColor, messages, isLoading, onSend, onClose, error }) {
  const [input, setInput] = useState('')
  const [inputFocused, setInputFocused] = useState(false)
  const messagesEndRef = useRef(null)
  const mascot = MASCOT_CONFIG[botConfig?.mascot_type] ?? MASCOT_CONFIG.pizza

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const handleSend = () => {
    const trimmed = input.trim()
    if (!trimmed || isLoading) return
    onSend(trimmed)
    setInput('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div
      className="chat-window-spring bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden w-80 sm:w-96"
      style={{ height: 'min(520px, 80vh)' }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0" style={{ background: brandColor }}>
        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-lg flex-shrink-0">
          {mascot.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-white truncate">{restaurant?.name ?? 'Restaurant Bot'}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-green-300 flex-shrink-0" />
            <span className="text-xs text-white/80">Online now</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0"
          aria-label="Close chat"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-8 px-2">
            <p className="text-3xl mb-2">{mascot.emoji}</p>
            <p className="text-sm font-medium text-gray-500">Hi! I&apos;m your restaurant assistant.</p>
            <p className="text-xs mt-1">Ask me about the menu, hours, or deals!</p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message-slide-in flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex flex-col gap-1 max-w-[78%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div
                className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed break-words ${
                  msg.role === 'user'
                    ? 'text-white rounded-br-sm'
                    : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                }`}
                style={msg.role === 'user' ? { backgroundColor: brandColor } : {}}
              >
                {msg.content}
              </div>
              <span className="text-[10px] text-gray-400 px-1">{formatTime(msg.timestamp)}</span>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
              {[0, 0.2, 0.4].map((delay, i) => (
                <span
                  key={i}
                  className="typing-dot w-2 h-2 rounded-full bg-gray-400 inline-block"
                  style={{ animationDelay: `${delay}s` }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="text-center text-xs text-red-500 bg-red-50 rounded-lg py-2 px-3">{error}</p>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick replies */}
      <div className="px-3 pb-2 flex-shrink-0">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
          {QUICK_REPLIES.map((reply) => (
            <button
              key={reply}
              onClick={() => !isLoading && onSend(reply)}
              disabled={isLoading}
              className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap disabled:opacity-40"
            >
              {reply}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="px-3 pb-3 flex-shrink-0">
        <div
          className="flex items-center gap-2 bg-gray-50 rounded-xl border px-3 py-2 transition-colors"
          style={{ borderColor: inputFocused ? brandColor : '#e5e7eb' }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            placeholder="Type a message..."
            disabled={isLoading}
            className="flex-1 bg-transparent text-sm outline-none text-gray-800 placeholder-gray-400 disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white transition-all disabled:opacity-40 flex-shrink-0 hover:opacity-90 active:scale-95"
            style={{ backgroundColor: brandColor }}
            aria-label="Send message"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M22 2L11 13" />
              <path d="M22 2L15 22L11 13L2 9L22 2Z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
