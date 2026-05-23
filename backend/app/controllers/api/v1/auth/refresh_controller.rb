# frozen_string_literal: true

module Api
  module V1
    module Auth
      class RefreshController < Api::ApplicationController
        include Api::Renderable

        skip_before_action :authenticate_user!

        def create
          user = User.find_by(refresh_token: params[:refresh_token])
          return render_error('Invalid or expired refresh token.', status: :unauthorized) unless user

          render_success({ token: JwtTokenService.call(user) })
        end
      end
    end
  end
end
