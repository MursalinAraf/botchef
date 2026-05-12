import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { baseApi } from '@/app/baseApi'
import BotConfigForm from './BotConfigForm'

vi.mock('../restaurantsApi', () => ({
  useGetBotConfigQuery: vi.fn(),
  useUpsertBotConfigMutation: vi.fn(),
}))

import { useGetBotConfigQuery, useUpsertBotConfigMutation } from '../restaurantsApi'

function makeStore() {
  return configureStore({
    reducer: { [baseApi.reducerPath]: baseApi.reducer },
    middleware: (gdm) => gdm().concat(baseApi.middleware),
  })
}

const restaurant = { id: 3, name: 'Sushi House' }

const existingConfig = {
  menu: 'Salmon Roll, Tuna Maki',
  delivery_info: 'Free over $30',
  deals: '10% off Tuesdays',
  rules: 'No refunds',
  tone: 'formal',
  mascot_type: 'sushi',
  brand_color: '#1a2b3c',
}

function renderForm(props = {}) {
  return render(
    <Provider store={makeStore()}>
      <BotConfigForm open={true} restaurant={restaurant} onClose={vi.fn()} {...props} />
    </Provider>
  )
}

describe('BotConfigForm', () => {
  beforeEach(() => {
    useGetBotConfigQuery.mockReturnValue({ data: undefined, isLoading: false })
    useUpsertBotConfigMutation.mockReturnValue([vi.fn(), { isLoading: false }])
  })

  it('shows a spinner while the bot config is loading', () => {
    useGetBotConfigQuery.mockReturnValue({ data: undefined, isLoading: true })
    renderForm()
    expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument()
  })

  it('renders form field labels once the data is ready', () => {
    renderForm()
    expect(screen.getByText(/^Delivery Info/)).toBeInTheDocument()
    expect(screen.getByText(/^Tone/)).toBeInTheDocument()
    expect(screen.getByText(/^Mascot/)).toBeInTheDocument()
    expect(screen.getByText(/^Brand Color/)).toBeInTheDocument()
  })

  it('pre-fills fields with existing bot config values', () => {
    useGetBotConfigQuery.mockReturnValue({ data: existingConfig, isLoading: false })
    renderForm()
    expect(screen.getByDisplayValue('Salmon Roll, Tuna Maki')).toBeInTheDocument()
    expect(screen.getAllByDisplayValue('#1a2b3c').length).toBeGreaterThanOrEqual(1)
  })

  it('shows tone and mascot options in English', () => {
    renderForm()
    expect(screen.getByRole('option', { name: 'Friendly' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: '🍕 Pizza' })).toBeInTheDocument()
  })

  it('calls upsertBotConfig with the restaurantId on submit', async () => {
    const mockUpsert = vi.fn().mockReturnValue({ unwrap: () => Promise.resolve({}) })
    useUpsertBotConfigMutation.mockReturnValue([mockUpsert, { isLoading: false }])
    useGetBotConfigQuery.mockReturnValue({ data: existingConfig, isLoading: false })
    const user = userEvent.setup()
    renderForm()

    await user.click(screen.getByRole('button', { name: 'Save Configuration' }))

    await waitFor(() => {
      expect(mockUpsert).toHaveBeenCalledWith(
        expect.objectContaining({ restaurantId: restaurant.id })
      )
    })
  })

  it('calls onClose when the Cancel button is clicked', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()
    renderForm({ onClose })
    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(onClose).toHaveBeenCalledOnce()
  })
})
