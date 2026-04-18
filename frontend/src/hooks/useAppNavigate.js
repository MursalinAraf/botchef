import {
    useNavigate
} from 'react-router-dom'
import {
    ROUTES
} from 'app/routes'

export default function useAppNavigate() {
    const navigate = useNavigate()

    return {
        toLogin: () => navigate(ROUTES.login),
        toSignup: () => navigate(ROUTES.signup),
        toDashboard: () => navigate(ROUTES.dashboard),
    }
}