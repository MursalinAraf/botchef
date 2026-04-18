module Api
  module V1
    module Auth
      class RegistrationsController < Devise::RegistrationsController
        include Api::Renderable

        def sign_in(_user, *_args); end

        private

        def respond_with(user, _opts = {})
          if user.persisted?
            token = JwtTokenService.call(user)
            response.headers['Authorization'] = "Bearer #{token}"

            render_success({
              token: token,
              user: UserSerializer.new(user).call
            }, :created)
          else
            render_errors(user.errors.full_messages)
          end
        end

        def sign_up_params
          params.require(:user).permit(
            :first_name,
            :last_name,
            :email,
            :password,
            :password_confirmation
          )
        end
      end
    end
  end
end