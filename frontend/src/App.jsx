import { ConfigProvider } from "antd";
import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from "react-router-dom";
import ProtectedRoute from "components/ProtectedRoute";
import LoginPage from "features/auth/LoginPage";
import SignupPage from "features/auth/SignupPage";
import HealthPage from "features/health/HealthPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <HealthPage />,
      },
    ],
  },
]);

const antTheme = {
  token: {
    colorPrimary: "#059669",
    borderRadius: 8,
    fontFamily: "Inter, sans-serif",
  },
};

export default function App() {
  return (
    <ConfigProvider theme={antTheme}>
      <RouterProvider router={router} />
    </ConfigProvider>
  );
}
