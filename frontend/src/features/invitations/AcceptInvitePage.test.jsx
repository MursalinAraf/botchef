import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { baseApi } from '@/app/baseApi'
import authReducer from '@/features/auth/authSlice'
import AcceptInvitePage from './AcceptInvitePage'

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal()
  return { ...actual, useParams: () => ({ token: 'test-token' }) }
})

vi.mock('./invitationsApi', () => ({
  useGetInvitationQuery: vi.fn(),
  useAcceptInvitationMutation: vi.fn(),
}))

vi.mock('hooks/useAppNavigate', () => ({
  default: vi.fn(),
}))

import { useGetInvitationQuery, useAcceptInvitationMutation } from './invitationsApi'
import useAppNavigate from 'hooks/useAppNavigate'

function makeStore() {
  return configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
      auth: authReducer,
    },
    middleware: (gdm) => gdm().concat(baseApi.middleware),
  })
}

function renderPage() {
  return render(
    <Provider store={makeStore()}>
      <AcceptInvitePage />
    </Provider>
  )
}

const pendingInvitation = {
  email: 'invitee@example.com',
  token: 'test-token',
  accepted: false,
  expired: false,
  expires_at: '2026-06-01T00:00:00Z',
  invited_by: { first_name: 'Ahmed', last_name: 'Rahman' },
}

describe('AcceptInvitePage', () => {
  const mockToDashboard = vi.fn()

  beforeEach(() => {
    mockToDashboard.mockClear()
    useAcceptInvitationMutation.mockReturnValue([vi.fn(), { isLoading: false }])
    useAppNavigate.mockReturnValue({ toDashboard: mockToDashboard })
  })

  it('shows a loading spinner while fetching', () => {
    useGetInvitationQuery.mockReturnValue({ data: undefined, isLoading: true, isError: false })
    renderPage()
    expect(document.querySelector('.ant-spin')).toBeInTheDocument()
  })

  it('shows not-found error when the API returns an error', () => {
    useGetInvitationQuery.mockReturnValue({ data: undefined, isLoading: false, isError: true })
    renderPage()
    expect(screen.getByText('This invitation link is invalid.')).toBeInTheDocument()
  })

  it('shows the inviter name and expiry info when loaded', () => {
    useGetInvitationQuery.mockReturnValue({ data: pendingInvitation, isLoading: false, isError: false })
    renderPage()
    expect(screen.getByText(/Invited by Ahmed Rahman/i)).toBeInTheDocument()
    expect(screen.getByText(/Expires on/i)).toBeInTheDocument()
  })

  it('displays the invitee email as read-only', () => {
    useGetInvitationQuery.mockReturnValue({ data: pendingInvitation, isLoading: false, isError: false })
    renderPage()
    expect(screen.getByText('invitee@example.com')).toBeInTheDocument()
  })

  it('renders all form fields for a pending invitation', () => {
    useGetInvitationQuery.mockReturnValue({ data: pendingInvitation, isLoading: false, isError: false })
    renderPage()
    expect(screen.getByText('First name')).toBeInTheDocument()
    expect(screen.getByText('Last name')).toBeInTheDocument()
    expect(screen.getByText('Password')).toBeInTheDocument()
    expect(screen.getByText('Confirm password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Create account' })).toBeInTheDocument()
  })

  it('shows an expired warning and hides the form when invitation is expired', () => {
    useGetInvitationQuery.mockReturnValue({
      data: { ...pendingInvitation, expired: true },
      isLoading: false,
      isError: false,
    })
    renderPage()
    expect(screen.getByText('This invitation has expired.')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Create account' })).not.toBeInTheDocument()
  })

  it('shows an already-accepted warning and hides the form when invitation is accepted', () => {
    useGetInvitationQuery.mockReturnValue({
      data: { ...pendingInvitation, accepted: true },
      isLoading: false,
      isError: false,
    })
    renderPage()
    expect(screen.getByText('This invitation has already been accepted.')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Create account' })).not.toBeInTheDocument()
  })

  it('calls acceptInvitation with the token and form values on submit', async () => {
    const mockAccept = vi.fn().mockReturnValue({
      unwrap: () => Promise.resolve({ token: 'jwt', user: { id: 1 } }),
    })
    useAcceptInvitationMutation.mockReturnValue([mockAccept, { isLoading: false }])
    useGetInvitationQuery.mockReturnValue({ data: pendingInvitation, isLoading: false, isError: false })
    const user = userEvent.setup()
    renderPage()

    await user.type(screen.getByPlaceholderText('Ahmed'), 'New')
    await user.type(screen.getByPlaceholderText('Rahman'), 'Admin')
    const [passwordField, confirmField] = screen.getAllByPlaceholderText('••••••••')
    await user.type(passwordField, 'password123')
    await user.type(confirmField, 'password123')
    await user.click(screen.getByRole('button', { name: 'Create account' }))

    await waitFor(() => {
      expect(mockAccept).toHaveBeenCalledWith(
        expect.objectContaining({
          token: 'test-token',
          first_name: 'New',
          last_name: 'Admin',
          password: 'password123',
          password_confirmation: 'password123',
        })
      )
    })
  })

  it('navigates to dashboard after successful accept', async () => {
    const mockAccept = vi.fn().mockReturnValue({
      unwrap: () => Promise.resolve({ token: 'jwt', user: { id: 1, role: 'admin' } }),
    })
    useAcceptInvitationMutation.mockReturnValue([mockAccept, { isLoading: false }])
    useGetInvitationQuery.mockReturnValue({ data: pendingInvitation, isLoading: false, isError: false })
    const user = userEvent.setup()
    renderPage()

    await user.type(screen.getByPlaceholderText('Ahmed'), 'New')
    await user.type(screen.getByPlaceholderText('Rahman'), 'Admin')
    const [passwordField, confirmField] = screen.getAllByPlaceholderText('••••••••')
    await user.type(passwordField, 'password123')
    await user.type(confirmField, 'password123')
    await user.click(screen.getByRole('button', { name: 'Create account' }))

    await waitFor(() => {
      expect(mockToDashboard).toHaveBeenCalledOnce()
    })
  })

  it('shows a server error message when accept fails', async () => {
    const mockAccept = vi.fn().mockReturnValue({
      unwrap: () => Promise.reject({ data: { error: 'User already exists.' } }),
    })
    useAcceptInvitationMutation.mockReturnValue([mockAccept, { isLoading: false }])
    useGetInvitationQuery.mockReturnValue({ data: pendingInvitation, isLoading: false, isError: false })
    const user = userEvent.setup()
    renderPage()

    await user.type(screen.getByPlaceholderText('Ahmed'), 'New')
    await user.type(screen.getByPlaceholderText('Rahman'), 'Admin')
    const [passwordField, confirmField] = screen.getAllByPlaceholderText('••••••••')
    await user.type(passwordField, 'password123')
    await user.type(confirmField, 'password123')
    await user.click(screen.getByRole('button', { name: 'Create account' }))

    await waitFor(() => {
      expect(screen.getByText('User already exists.')).toBeInTheDocument()
    })
  })

  it('shows a validation error when passwords do not match', async () => {
    useGetInvitationQuery.mockReturnValue({ data: pendingInvitation, isLoading: false, isError: false })
    const user = userEvent.setup()
    renderPage()

    await user.type(screen.getByPlaceholderText('Ahmed'), 'New')
    await user.type(screen.getByPlaceholderText('Rahman'), 'Admin')
    const [passwordField, confirmField] = screen.getAllByPlaceholderText('••••••••')
    await user.type(passwordField, 'password123')
    await user.type(confirmField, 'different')
    await user.click(screen.getByRole('button', { name: 'Create account' }))

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument()
    })
  })
})
