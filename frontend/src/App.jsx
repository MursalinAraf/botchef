import { ConfigProvider } from 'antd'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import HealthPage from '@/pages/HealthPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <HealthPage />,
  },
])

// Ant Design theme tokens - brand colors wired in here
const antTheme = {
  token: {
    colorPrimary: '#ff6b6b',
    borderRadius: 8,
    fontFamily: 'Inter, sans-serif',
  },
}

export default function App() {
  return (
    <ConfigProvider theme={antTheme}>
      <RouterProvider router={router} />
    </ConfigProvider>
  )
}
