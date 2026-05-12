import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { baseApi } from '@/app/baseApi'
import authReducer from '@/features/auth/authSlice'
import DashboardPage from './DashboardPage'

vi.mock('./restaurantsApi', () => ({
  useGetRestaurantsQuery: vi.fn(),
}))

vi.mock('@/features/auth/authApi', () => ({
  useLogoutMutation: vi.fn(),
}))

vi.mock('./components/DashboardMetrics', () => ({
  default: () => <div data-testid="dashboard-metrics" />,
}))

vi.mock('./components/RestaurantList', () => ({
  default: () => <div data-testid="restaurant-list" />,
}))

vi.mock('./components/CreateRestaurantModal', () => ({ default: () => null }))
vi.mock('./components/BotConfigForm', () => ({ default: () => null }))
vi.mock('features/invitations/components/InviteUserModal', () => ({
  default: ({ open }) => open ? <div data-testid="invite-modal" /> : null,
}))

import { useGetRestaurantsQuery } from './restaurantsApi'
import { useLogoutMutation } from '@/features/auth/authApi'

const testUser  = { first_name: 'Ahmed', last_name: 'Rahman', email: 'ahmed@test.com', role: 'user' }
const adminUser = { first_name: 'Araf',  last_name: 'Admin',  email: 'araf@admin.com',  role: 'admin' }

function makeStore(preloadedState = {}) {
  return configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
      auth: authReducer,
    },
    middleware: (gdm) => gdm().concat(baseApi.middleware),
    preloadedState,
  })
}

function renderPage(authState = { token: 'tok', user: testUser }) {
  return render(
    <Provider store={makeStore({ auth: authState })}>
      <DashboardPage />
    </Provider>
  )
}

describe('DashboardPage', () => {
  beforeEach(() => {
    useGetRestaurantsQuery.mockReturnValue({ data: [], isLoading: false })
    useLogoutMutation.mockReturnValue([vi.fn(), { isLoading: false }])
  })

  it('renders the Restaurants nav label in the sidebar', () => {
    renderPage()
    // "Restaurants" also appears as the page heading; getAllByText ensures both render
    expect(screen.getAllByText('Restaurants').length).toBeGreaterThanOrEqual(1)
  })

  it('renders the page subtitle', () => {
    renderPage()
    expect(screen.getByText('Manage your restaurants and bot configurations')).toBeInTheDocument()
  })

  it('renders the New Restaurant button', () => {
    renderPage()
    expect(screen.getByRole('button', { name: /New Restaurant/i })).toBeInTheDocument()
  })

  it('shows the current user full name and email in the sidebar', () => {
    renderPage()
    expect(screen.getByText('Ahmed Rahman')).toBeInTheDocument()
    expect(screen.getByText('ahmed@test.com')).toBeInTheDocument()
  })

  it('shows the user first initial in the avatar', () => {
    renderPage()
    expect(screen.getByText('A')).toBeInTheDocument()
  })

  it('calls the logout mutation when Sign out is clicked', async () => {
    const mockLogout = vi.fn().mockReturnValue({ unwrap: () => Promise.resolve() })
    useLogoutMutation.mockReturnValue([mockLogout, { isLoading: false }])
    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByText('Sign out'))
    expect(mockLogout).toHaveBeenCalledOnce()
  })

  it('renders the metrics and restaurant list sections', () => {
    renderPage()
    expect(screen.getByTestId('dashboard-metrics')).toBeInTheDocument()
    expect(screen.getByTestId('restaurant-list')).toBeInTheDocument()
  })

  it('does not show the Invite Admin button for a regular user', () => {
    renderPage({ token: 'tok', user: testUser })
    expect(screen.queryByRole('button', { name: /Invite Admin/i })).not.toBeInTheDocument()
  })

  it('shows the Invite Admin button for an admin user', () => {
    renderPage({ token: 'tok', user: adminUser })
    expect(screen.getByRole('button', { name: /Invite Admin/i })).toBeInTheDocument()
  })

  it('opens the InviteUserModal when Invite Admin is clicked', async () => {
    const user = userEvent.setup()
    renderPage({ token: 'tok', user: adminUser })

    expect(screen.queryByTestId('invite-modal')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Invite Admin/i }))
    expect(screen.getByTestId('invite-modal')).toBeInTheDocument()
  })
})
