export const ROUTES = {
    home: '/',
    login: '/login',
    signup: '/signup',
    dashboard: '/dashboard',
    invite: '/invite/:token',
    inviteAccept: (token) => `/invite/${token}`,
}