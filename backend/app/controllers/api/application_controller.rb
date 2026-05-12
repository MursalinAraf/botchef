module Api
  class ApplicationController < ActionController::API
    include Api::Renderable

    before_action :authenticate_user!

    private

    def require_admin!
      render_error('Forbidden.', status: :forbidden) unless current_user&.admin?
    end
  end
end