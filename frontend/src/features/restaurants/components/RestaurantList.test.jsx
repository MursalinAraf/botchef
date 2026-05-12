import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RestaurantList from './RestaurantList'

vi.mock('./RestaurantCard', () => ({
  default: ({ restaurant }) => <div data-testid="restaurant-card">{restaurant.name}</div>,
}))

const restaurants = [
  { id: 1, name: 'Burger Palace', bot_config: null },
  { id: 2, name: 'Sushi House', bot_config: { menu: 'Salmon Roll' } },
]

describe('RestaurantList', () => {
  it('shows a loading spinner while fetching', () => {
    render(
      <RestaurantList restaurants={[]} isLoading={true} onEdit={vi.fn()} onConfigure={vi.fn()} onCreateNew={vi.fn()} />
    )
    expect(document.querySelector('.ant-spin')).toBeInTheDocument()
  })

  it('shows the empty state message when there are no restaurants', () => {
    render(
      <RestaurantList restaurants={[]} isLoading={false} onEdit={vi.fn()} onConfigure={vi.fn()} onCreateNew={vi.fn()} />
    )
    expect(screen.getByText('No restaurants yet')).toBeInTheDocument()
    expect(screen.getByText('Add your first restaurant to get started')).toBeInTheDocument()
  })

  it('shows an Add Restaurant button in the empty state', () => {
    render(
      <RestaurantList restaurants={[]} isLoading={false} onEdit={vi.fn()} onConfigure={vi.fn()} onCreateNew={vi.fn()} />
    )
    expect(screen.getByText('Add Restaurant')).toBeInTheDocument()
  })

  it('calls onCreateNew when the empty-state button is clicked', async () => {
    const onCreateNew = vi.fn()
    const user = userEvent.setup()
    render(
      <RestaurantList restaurants={[]} isLoading={false} onEdit={vi.fn()} onConfigure={vi.fn()} onCreateNew={onCreateNew} />
    )
    await user.click(screen.getByText('Add Restaurant'))
    expect(onCreateNew).toHaveBeenCalledOnce()
  })

  it('renders a card for each restaurant', () => {
    render(
      <RestaurantList restaurants={restaurants} isLoading={false} onEdit={vi.fn()} onConfigure={vi.fn()} onCreateNew={vi.fn()} />
    )
    expect(screen.getAllByTestId('restaurant-card')).toHaveLength(2)
    expect(screen.getByText('Burger Palace')).toBeInTheDocument()
    expect(screen.getByText('Sushi House')).toBeInTheDocument()
  })
})
