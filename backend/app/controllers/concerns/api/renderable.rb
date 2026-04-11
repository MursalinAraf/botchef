module Api
  module Renderable
    private

    def render_success(data, status = :ok)
      render json: data, status: status
    end

    def render_error(message, status: :unprocessable_entity)
      render json: { error: message }, status: status
    end

    def render_errors(messages, status: :unprocessable_entity)
      render json: { errors: messages }, status: status
    end
  end
end