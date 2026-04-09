module Api
  module V1
    class HealthController < Api::ApplicationController
      def show
        render json: {
          status: 'ok',
          version: 'v1',
          environment: Rails.env,
          timestamp: Time.current.iso8601
        }
      end
    end
  end
end
