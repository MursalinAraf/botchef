import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import EmbedCodeCard from './EmbedCodeCard'

const restaurant = { id: 42, name: 'Test Restaurant', bot_config: { mascot_type: 'pizza' } }

function setup() {
  const mockWriteText = vi.fn().mockResolvedValue(undefined)
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText: mockWriteText },
    configurable: true,
  })
  render(<EmbedCodeCard restaurant={restaurant} />)
  return { mockWriteText }
}

describe('EmbedCodeCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the embed code containing the restaurant id', () => {
    setup()
    expect(screen.getByText(/data-bot-id="42"/)).toBeInTheDocument()
  })

  it('shows the embed title and instruction text', () => {
    setup()
    expect(screen.getByText('Embed Code')).toBeInTheDocument()
    expect(screen.getByText(/Paste this before/)).toBeInTheDocument()
  })

  it('copies the embed code to clipboard when Copy is clicked', async () => {
    const { mockWriteText } = setup()
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /copy/i }))
    expect(mockWriteText).toHaveBeenCalledOnce()
    expect(mockWriteText).toHaveBeenCalledWith(expect.stringContaining('data-bot-id="42"'))
  })

  it('shows "Copied!" feedback after copying', async () => {
    setup()
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /copy/i }))
    expect(await screen.findByText('Copied!')).toBeInTheDocument()
  })
})
