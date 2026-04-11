module Api
  module V1
    module Auth
      class RegistrationsController < Devise::RegistrationsController
        respond_to :json

        def sign_in(_user, *_args); end

        private

        def respond_with(user, _opts = {})
          if user.persisted?
            token = JwtTokenService.call(user)
            response.headers['Authorization'] = "Bearer #{token}"

            render json: {
              message: 'Signed up successfully.',
              user: UserSerializer.new(user).call
            }, status: :created
          else
            render json: {
              message: 'Signup failed.',
              errors: user.errors.full_messages
            }, status: :unprocessable_entity
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