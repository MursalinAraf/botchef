module Api
  module V1
    module Auth
      class SessionsController < Devise::SessionsController
        include Api::Renderable

        private

        def respond_with(user, _opts = {})
          if user.persisted?
            token         = request.env['warden-jwt_auth.token']
            refresh_token = user.generate_refresh_token!
            render_success({
              token:         token,
              refresh_token: refresh_token,
              user:          UserSerializer.new(user).call
            })
          else
            render_error('Invalid email or password.', status: :unauthorized)
          end
        end

        def respond_to_on_destroy(*_args)
          if request.headers['Authorization'].present?
            current_user&.invalidate_refresh_token!
            render_success({})
          else
            render_error('No active session found.', status: :unauthorized)
          end
        end
      end
    end
  end
end
