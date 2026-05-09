import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { ROUTES } from "app/routes";
import ProtectedRoute from "components/ProtectedRoute";
import LoginPage from "features/auth/LoginPage";
import SignupPage from "features/auth/SignupPage";
import DashboardPage from "features/restaurants/DashboardPage";

const router = createBrowserRouter([
  { path: ROUTES.home, element: <Navigate to={ROUTES.login} replace /> },
  { path: ROUTES.login, element: <LoginPage /> },
  { path: ROUTES.signup, element: <SignupPage /> },
  {
    path: ROUTES.dashboard,
    element: <ProtectedRoute />,
    children: [{ index: true, element: <DashboardPage /> }],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
