# frozen_string_literal: true

module Api
  module V1
    module Public
      class ChatsController < Api::ApplicationController
        include Api::Renderable

        MAX_HISTORY        = 20
        MAX_MESSAGE_LENGTH = 1000

        skip_before_action :authenticate_user!
        before_action :set_restaurant

        def create
          unless @restaurant.bot_config
            return render_error('This restaurant has not configured its bot yet.', status: :unprocessable_entity)
          end

          messages = sanitized_messages
          return render_error('messages must be a non-empty array.', status: :unprocessable_entity) if messages.empty?

          system_prompt = SystemPromptBuilder.call(restaurant: @restaurant, bot_config: @restaurant.bot_config)
          response_text = GroqService.call(system_prompt: system_prompt, messages: messages)

          render_success({ response: response_text })
        rescue StandardError => e
          render_error(e.message, status: :unprocessable_entity)
        end

        private

        def set_restaurant
          @restaurant = Restaurant.find_by!(public_token: params[:restaurant_id])
        rescue ActiveRecord::RecordNotFound
          render_error('Restaurant not found.', status: :not_found)
        end

        def sanitized_messages
          raw = params[:messages]
          return [] unless raw.is_a?(Array)

          raw.last(MAX_HISTORY).filter_map do |msg|
            role    = msg[:role].to_s
            content = msg[:content].to_s.strip
            next unless %w[user assistant].include?(role) && content.present?
            next if content.length > MAX_MESSAGE_LENGTH

            { role: role, content: content }
          end
        end
      end
    end
  end
end
