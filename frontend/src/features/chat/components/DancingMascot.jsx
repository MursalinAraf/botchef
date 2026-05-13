import { useState, useEffect } from 'react'
import { MASCOT_CONFIG } from 'utils/botConfig'
import '../chat.css'

const SPEECH_MESSAGES = [
  'Hey! Ask me anything! 👋',
  'Our menu is amazing! 🌟',
  'Best deals inside! 🎉',
  'Free delivery nearby! 🚀',
]

export default function DancingMascot({ mascotType = 'pizza', isOpen = false, onClick }) {
  const mascot = MASCOT_CONFIG[mascotType] ?? MASCOT_CONFIG.pizza
  const [speechIndex, setSpeechIndex] = useState(0)
  const [speechVisible, setSpeechVisible] = useState(true)

  useEffect(() => {
    if (isOpen) return
    const timer = setInterval(() => {
      setSpeechVisible(false)
      setTimeout(() => {
        setSpeechIndex(i => (i + 1) % SPEECH_MESSAGES.length)
        setSpeechVisible(true)
      }, 280)
    }, 3000)
    return () => clearInterval(timer)
  }, [isOpen])

  return (
    <div className="relative flex flex-col items-center" style={{ width: 80 }}>
      {/* Speech bubble */}
      {!isOpen && speechVisible && (
        <div
          key={speechIndex}
          className="speech-pop absolute bottom-full mb-2 right-0 bg-white border border-gray-100 rounded-2xl rounded-br-none px-3 py-2 shadow-lg text-xs text-gray-700 whitespace-nowrap font-medium z-10"
        >
          {SPEECH_MESSAGES[speechIndex]}
          {/* triangle tail */}
          <span
            style={{
              position: 'absolute',
              bottom: -6,
              right: 10,
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '6px solid white',
            }}
          />
        </div>
      )}

      {/* Character wrapper — bounces when closed */}
      <div
        className={`relative cursor-pointer select-none ${!isOpen ? 'mascot-bouncing' : ''}`}
        onClick={onClick}
        role="button"
        aria-label="Open chat"
      >
        {/* Sparkles (only when idle) */}
        {!isOpen && (
          <div className="absolute inset-0 pointer-events-none overflow-visible">
            <span className="sparkle-1 absolute -top-1 left-0 text-[9px]" style={{ color: mascot.primary }}>✦</span>
            <span className="sparkle-2 absolute top-1 right-0 text-[7px]" style={{ color: mascot.primary }}>★</span>
            <span className="sparkle-3 absolute top-3 left-1/3 text-[10px]" style={{ color: mascot.primary }}>✦</span>
          </div>
        )}

        {/* Arms + body row */}
        <div className="relative flex items-center">
          {/* Left arm */}
          <div
            className={`rounded-full ${!isOpen ? 'arm-wave-left' : ''}`}
            style={{
              width: 10,
              height: 24,
              backgroundColor: mascot.primary,
              marginRight: -4,
              zIndex: 0,
            }}
          />

          {/* Body */}
          <div
            className="relative rounded-full flex items-center justify-center shadow-md z-10 text-2xl"
            style={{
              width: 52,
              height: 52,
              backgroundColor: mascot.light,
              border: `2.5px solid ${mascot.primary}44`,
            }}
          >
            {mascot.emoji}
          </div>

          {/* Right arm */}
          <div
            className={`rounded-full ${!isOpen ? 'arm-wave-right' : ''}`}
            style={{
              width: 10,
              height: 24,
              backgroundColor: mascot.primary,
              marginLeft: -4,
              zIndex: 0,
            }}
          />
        </div>

        {/* Legs */}
        <div className="flex justify-center gap-2 mt-1">
          <div
            className={`rounded-full ${!isOpen ? 'leg-swing-left' : ''}`}
            style={{ width: 12, height: 20, backgroundColor: mascot.primary + 'bb' }}
          />
          <div
            className={`rounded-full ${!isOpen ? 'leg-swing-right' : ''}`}
            style={{ width: 12, height: 20, backgroundColor: mascot.primary + 'bb' }}
          />
        </div>
      </div>
    </div>
  )
}
