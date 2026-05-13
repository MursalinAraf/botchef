import { useState, useCallback, useRef } from 'react'
import { useSendMessageMutation } from './chatApi'

let msgId = 0
const nextId = () => ++msgId

export default function useChatMessages(restaurantId) {
  const [messages, setMessages] = useState([])
  const [error, setError] = useState(null)
  const [sendMessageMutation, { isLoading }] = useSendMessageMutation()
  const messagesRef = useRef([])
  messagesRef.current = messages

  const sendMessage = useCallback(async (content) => {
    setError(null)

    const userMsg = { id: nextId(), role: 'user', content, timestamp: new Date() }
    const snapshot = messagesRef.current
    setMessages(prev => [...prev, userMsg])

    try {
      const apiMessages = [...snapshot, userMsg].map(({ role, content: c }) => ({ role, content: c }))
      const result = await sendMessageMutation({ restaurantId, messages: apiMessages }).unwrap()
      setMessages(prev => [
        ...prev,
        { id: nextId(), role: 'assistant', content: result.response, timestamp: new Date() },
      ])
    } catch {
      setError('Something went wrong. Please try again.')
    }
  }, [restaurantId, sendMessageMutation])

  return { messages, sendMessage, isLoading, error }
}
