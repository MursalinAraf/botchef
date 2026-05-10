import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { baseApi } from '@/app/baseApi'
import CreateRestaurantModal from './CreateRestaurantModal'

vi.mock('../restaurantsApi', () => ({
  useCreateRestaurantMutation: vi.fn(),
  useUpdateRestaurantMutation: vi.fn(),
}))

import { useCreateRestaurantMutation, useUpdateRestaurantMutation } from '../restaurantsApi'

function makeStore() {
  return configureStore({
    reducer: { [baseApi.reducerPath]: baseApi.reducer },
    middleware: (gdm) => gdm().concat(baseApi.middleware),
  })
}

function renderModal(props) {
  return render(
    <Provider store={makeStore()}>
      <CreateRestaurantModal open={true} onClose={vi.fn()} {...props} />
    </Provider>
  )
}

const validValues = {
  name: 'The Golden Fork',
  phone: '+1-555-0000',
  location: '123 Main St',
  opening_hours: 'Mon-Fri 9am-10pm',
}

describe('CreateRestaurantModal', () => {
  beforeEach(() => {
    useCreateRestaurantMutation.mockReturnValue([vi.fn(), { isLoading: false }])
    useUpdateRestaurantMutation.mockReturnValue([vi.fn(), { isLoading: false }])
  })

  it('shows "New Restaurant" title in create mode', () => {
    renderModal({ restaurant: null })
    expect(screen.getByText('New Restaurant')).toBeInTheDocument()
  })

  it('shows "Edit Restaurant" title when a restaurant is passed', () => {
    renderModal({ restaurant: { id: 1, ...validValues } })
    expect(screen.getByText('Edit Restaurant')).toBeInTheDocument()
  })

  it('renders all field labels', () => {
    renderModal({ restaurant: null })
    expect(screen.getByText('Restaurant Name')).toBeInTheDocument()
    expect(screen.getByText('Phone Number')).toBeInTheDocument()
    expect(screen.getByText('Location')).toBeInTheDocument()
    expect(screen.getByText('Opening Hours')).toBeInTheDocument()
  })

  it('calls onClose when the Cancel button is clicked', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()
    renderModal({ restaurant: null, onClose })
    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('calls createRestaurant with form values on valid submit', async () => {
    const mockCreate = vi.fn().mockReturnValue({ unwrap: () => Promise.resolve({ id: 1 }) })
    useCreateRestaurantMutation.mockReturnValue([mockCreate, { isLoading: false }])
    const user = userEvent.setup()
    renderModal({ restaurant: null })

    await user.type(screen.getByPlaceholderText('The Golden Fork'), validValues.name)
    await user.type(screen.getByPlaceholderText('+1 (555) 000-0000'), validValues.phone)
    await user.type(screen.getByPlaceholderText('123 Main St, New York, NY'), validValues.location)
    await user.type(screen.getByPlaceholderText('Mon–Fri 9am–10pm, Sat–Sun 10am–11pm'), validValues.opening_hours)
    await user.click(screen.getByRole('button', { name: 'Create Restaurant' }))

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledWith(expect.objectContaining({ name: validValues.name }))
    })
  })

  it('calls updateRestaurant with the restaurant id on edit submit', async () => {
    const mockUpdate = vi.fn().mockReturnValue({ unwrap: () => Promise.resolve({ id: 5 }) })
    useUpdateRestaurantMutation.mockReturnValue([mockUpdate, { isLoading: false }])
    const user = userEvent.setup()
    renderModal({ restaurant: { id: 5, ...validValues } })

    await user.click(screen.getByRole('button', { name: 'Save Changes' }))

    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalledWith(expect.objectContaining({ id: 5 }))
    })
  })
})
