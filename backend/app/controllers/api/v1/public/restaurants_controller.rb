# frozen_string_literal: true

module Api
  module V1
    module Public
      class RestaurantsController < Api::ApplicationController
        include Api::Renderable

        skip_before_action :authenticate_user!

        def show
          restaurant = Restaurant.find_by!(public_token: params[:id])
          render_success(serialize(restaurant))
        rescue ActiveRecord::RecordNotFound
          render_error('Restaurant not found.', status: :not_found)
        end

        private

        def serialize(restaurant)
          {
            id: restaurant.id,
            name: restaurant.name,
            phone: restaurant.phone,
            location: restaurant.location,
            opening_hours: restaurant.opening_hours,
            bot_config: serialize_bot_config(restaurant.bot_config)
          }
        end

        def serialize_bot_config(bot_config)
          return nil unless bot_config

          {
            menu: bot_config.menu,
            delivery_info: bot_config.delivery_info,
            deals: bot_config.deals,
            tone: bot_config.tone,
            mascot_type: bot_config.mascot_type,
            brand_color: bot_config.brand_color
          }
        end
      end
    end
  end
end
