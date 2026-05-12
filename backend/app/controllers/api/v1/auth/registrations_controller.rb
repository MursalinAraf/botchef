module Api
  module V1
    module Auth
      class RegistrationsController < Devise::RegistrationsController
        include Api::Renderable

        def create
          user = UserCreationService.call(sign_up_params)

          if user.save
            token = JwtTokenService.call(user)
            response.headers['Authorization'] = "Bearer #{token}"
            render_success({ token: token, user: UserSerializer.call(user) }, :created)
          else
            render_errors(user.errors.full_messages)
          end
        end

        private

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
