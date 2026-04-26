module Api
  class ApplicationController < ActionController::API
    include Api::Renderable

    before_action :authenticate_user!

    private

    def render_error(message, status: :unprocessable_entity)
      render json: { error: message }, status: status
    end
  end
end