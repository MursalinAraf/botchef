import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { baseApi } from '@/app/baseApi'
import RestaurantCard from './RestaurantCard'

vi.mock('../restaurantsApi', () => ({
  useDeleteRestaurantMutation: vi.fn(),
}))

import { useDeleteRestaurantMutation } from '../restaurantsApi'

function makeStore() {
  return configureStore({
    reducer: { [baseApi.reducerPath]: baseApi.reducer },
    middleware: (gdm) => gdm().concat(baseApi.middleware),
  })
}

const restaurantWithBot = {
  id: 1,
  name: 'Burger Palace',
  location: 'Downtown, NY',
  phone: '+1-555-1234',
  opening_hours: 'Mon–Sun 10am–10pm',
  bot_config: { menu: 'Burgers' },
}

const restaurantWithoutBot = { ...restaurantWithBot, id: 2, bot_config: null }

function renderCard(restaurant, props = {}) {
  return render(
    <Provider store={makeStore()}>
      <RestaurantCard restaurant={restaurant} onEdit={vi.fn()} onConfigure={vi.fn()} {...props} />
    </Provider>
  )
}

describe('RestaurantCard', () => {
  beforeEach(() => {
    useDeleteRestaurantMutation.mockReturnValue([vi.fn(), { isLoading: false }])
  })

  it('displays restaurant name, location, phone, and opening hours', () => {
    renderCard(restaurantWithBot)
    expect(screen.getByText('Burger Palace')).toBeInTheDocument()
    expect(screen.getByText('Downtown, NY')).toBeInTheDocument()
    expect(screen.getByText('+1-555-1234')).toBeInTheDocument()
    expect(screen.getByText('Mon–Sun 10am–10pm')).toBeInTheDocument()
  })

  it('shows "Bot Active" tag when bot config exists', () => {
    renderCard(restaurantWithBot)
    expect(screen.getByText('Bot Active')).toBeInTheDocument()
  })

  it('shows "No Bot" tag when bot config is absent', () => {
    renderCard(restaurantWithoutBot)
    expect(screen.getByText('No Bot')).toBeInTheDocument()
  })

  it('calls onEdit with the restaurant when the edit button is clicked', async () => {
    const onEdit = vi.fn()
    const user = userEvent.setup()
    renderCard(restaurantWithBot, { onEdit })
    await user.click(screen.getByRole('button', { name: /edit/i }))
    expect(onEdit).toHaveBeenCalledWith(restaurantWithBot)
  })

  it('calls onConfigure with the restaurant when Configure Bot is clicked', async () => {
    const onConfigure = vi.fn()
    const user = userEvent.setup()
    renderCard(restaurantWithBot, { onConfigure })
    await user.click(screen.getByText('Configure Bot'))
    expect(onConfigure).toHaveBeenCalledWith(restaurantWithBot)
  })
})
