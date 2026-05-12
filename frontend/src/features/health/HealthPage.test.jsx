import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { baseApi } from '@/app/baseApi'
import HealthPage from '@/features/health/HealthPage'

// Helper: creates a fresh store for each test
function makeStore() {
  return configureStore({
    reducer: { [baseApi.reducerPath]: baseApi.reducer },
    middleware: (gdm) => gdm().concat(baseApi.middleware),
  })
}

// Mock the health API hook so we don't need a real server
vi.mock('@/features/health/healthApi', () => ({
  useGetHealthQuery: vi.fn(),
}))

import { useGetHealthQuery } from '@/features/health/healthApi'

describe('HealthPage', () => {
  it('shows loading spinner while fetching', () => {
    useGetHealthQuery.mockReturnValue({ isLoading: true })
    render(<Provider store={makeStore()}><HealthPage /></Provider>)
    expect(document.querySelector('.ant-spin')).toBeInTheDocument()
  })

  it('shows error when backend is unreachable', () => {
    useGetHealthQuery.mockReturnValue({ isLoading: false, isError: true })
    render(<Provider store={makeStore()}><HealthPage /></Provider>)
    expect(screen.getByText(/Backend not reachable/i)).toBeInTheDocument()
  })

  it('shows connected status when API responds', () => {
    useGetHealthQuery.mockReturnValue({
      isLoading: false,
      isError: false,
      data: { status: 'ok', version: 'v1', environment: 'development' },
    })
    render(<Provider store={makeStore()}><HealthPage /></Provider>)
    expect(screen.getByText('API connected')).toBeInTheDocument()
    expect(screen.getByText('ok')).toBeInTheDocument()
    expect(screen.getByText('v1')).toBeInTheDocument()
  })
})
