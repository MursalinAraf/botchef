import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { baseApi } from '@/app/baseApi'
import InviteUserModal from './InviteUserModal'

vi.mock('../invitationsApi', () => ({
  useSendInvitationMutation: vi.fn(),
}))

import { useSendInvitationMutation } from '../invitationsApi'

function makeStore() {
  return configureStore({
    reducer: { [baseApi.reducerPath]: baseApi.reducer },
    middleware: (gdm) => gdm().concat(baseApi.middleware),
  })
}

function renderModal(props = {}) {
  return render(
    <Provider store={makeStore()}>
      <InviteUserModal open={true} onClose={vi.fn()} {...props} />
    </Provider>
  )
}

describe('InviteUserModal', () => {
  beforeEach(() => {
    useSendInvitationMutation.mockReturnValue([vi.fn(), { isLoading: false }])
  })

  it('renders the modal title', () => {
    renderModal()
    expect(screen.getByText('Invite Admin')).toBeInTheDocument()
  })

  it('renders the email input and Send Invitation button', () => {
    renderModal()
    expect(screen.getByText('Email address')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Send Invitation' })).toBeInTheDocument()
  })

  it('shows a required validation error when submitting without email', async () => {
    const user = userEvent.setup()
    renderModal()
    await user.click(screen.getByRole('button', { name: 'Send Invitation' }))
    await waitFor(() => {
      expect(screen.getByText('Required')).toBeInTheDocument()
    })
  })

  it('shows an invalid email error for a bad email format', async () => {
    const user = userEvent.setup()
    renderModal()
    await user.type(screen.getByPlaceholderText('admin@example.com'), 'not-an-email')
    await user.click(screen.getByRole('button', { name: 'Send Invitation' }))
    await waitFor(() => {
      expect(screen.getByText('Must be a valid email address')).toBeInTheDocument()
    })
  })

  it('calls sendInvitation with the entered email on submit', async () => {
    const mockSend = vi.fn().mockReturnValue({ unwrap: () => Promise.resolve({}) })
    useSendInvitationMutation.mockReturnValue([mockSend, { isLoading: false }])
    const user = userEvent.setup()
    renderModal()

    await user.type(screen.getByPlaceholderText('admin@example.com'), 'new@admin.com')
    await user.click(screen.getByRole('button', { name: 'Send Invitation' }))

    await waitFor(() => {
      expect(mockSend).toHaveBeenCalledWith('new@admin.com')
    })
  })

  it('shows a success message with the sent-to email after sending', async () => {
    const mockSend = vi.fn().mockReturnValue({ unwrap: () => Promise.resolve({}) })
    useSendInvitationMutation.mockReturnValue([mockSend, { isLoading: false }])
    const user = userEvent.setup()
    renderModal()

    await user.type(screen.getByPlaceholderText('admin@example.com'), 'new@admin.com')
    await user.click(screen.getByRole('button', { name: 'Send Invitation' }))

    await waitFor(() => {
      expect(screen.getByText('Invitation sent to new@admin.com')).toBeInTheDocument()
    })
  })

  it('calls onClose when Cancel is clicked', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()
    renderModal({ onClose })
    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('shows a server error message if sending fails', async () => {
    const mockSend = vi.fn().mockReturnValue({
      unwrap: () => Promise.reject({ data: { error: 'Email already invited.' } }),
    })
    useSendInvitationMutation.mockReturnValue([mockSend, { isLoading: false }])
    const user = userEvent.setup()
    renderModal()

    await user.type(screen.getByPlaceholderText('admin@example.com'), 'existing@admin.com')
    await user.click(screen.getByRole('button', { name: 'Send Invitation' }))

    await waitFor(() => {
      expect(screen.getByText('Email already invited.')).toBeInTheDocument()
    })
  })
})
