export const API_ROUTES = {
    auth: {
        signup: '/auth/signup',
        login: '/auth/login',
        logout: '/auth/logout',
    },
    health: '/health',
    restaurants: {
        index: '/restaurants',
        show: (id) => `/restaurants/${id}`,
        botConfig: (restaurantId) => `/restaurants/${restaurantId}/bot_config`,
        upsertBotConfig: (restaurantId) => `/restaurants/${restaurantId}/bot_config/upsert`,
    },
}