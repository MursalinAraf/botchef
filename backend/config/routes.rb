Rails.application.routes.draw do
  devise_for :users,
    path: 'api/v1/auth',
    path_names: {
      sign_in: 'login',
      sign_out: 'logout',
      registration: 'signup'
    },
    controllers: {
      sessions: 'api/v1/auth/sessions',
      registrations: 'api/v1/auth/registrations'
    },
    skip: [:passwords, :confirmations, :unlocks]

  namespace :api do
    namespace :v1 do
      get 'health', to: 'health#show'
    end
  end
end