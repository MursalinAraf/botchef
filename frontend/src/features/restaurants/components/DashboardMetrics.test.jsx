import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import DashboardMetrics from './DashboardMetrics'

const withBot = { id: 1, bot_config: { menu: 'Pasta' } }
const withoutBot = { id: 2, bot_config: null }

describe('DashboardMetrics', () => {
  it('renders all three metric card labels', () => {
    render(<DashboardMetrics restaurants={[]} />)
    expect(screen.getByText('Total Restaurants')).toBeInTheDocument()
    expect(screen.getByText('Bots Configured')).toBeInTheDocument()
    expect(screen.getByText('Pending Setup')).toBeInTheDocument()
  })

  it('shows zero for all counts when there are no restaurants', () => {
    render(<DashboardMetrics restaurants={[]} />)
    expect(screen.getAllByText('0')).toHaveLength(3)
  })

  it('shows the correct total count', () => {
    render(<DashboardMetrics restaurants={[withBot, withoutBot]} />)
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('counts configured bots and pending restaurants correctly', () => {
    render(<DashboardMetrics restaurants={[withBot, withBot, withoutBot]} />)
    expect(screen.getByText('3')).toBeInTheDocument() // total
    expect(screen.getByText('2')).toBeInTheDocument() // configured
    expect(screen.getByText('1')).toBeInTheDocument() // pending
  })
})
