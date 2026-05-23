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
      get  'health',       to: 'health#show'
      post 'auth/refresh', to: 'auth/refresh#create'

      namespace :public do
        resources :restaurants, only: [:show] do
          resources :chats, only: [:create]
        end
      end

      resources :restaurants, only: [:index, :show, :create, :update, :destroy] do
        resource :bot_config, only: [:show], controller: 'bot_configs'
        put 'bot_config/upsert', to: 'bot_configs#upsert'
        resources :chats, only: [:create]
      end

      resources :invitations, only: [:create, :show], param: :token do
        member do
          post :accept
        end
      end
    end
  end
end