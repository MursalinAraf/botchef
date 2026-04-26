module Api
  module V1
    class BotConfigsController < Api::ApplicationController
      before_action :set_restaurant

      def show
        bot_config = @restaurant.bot_config

        if bot_config
          render_success(BotConfigSerializer.new(bot_config).call)
        else
          render_error('Bot config not found.', status: :not_found)
        end
      end

      def upsert
        bot_config = @restaurant.bot_config || @restaurant.build_bot_config

        if bot_config.update(bot_config_params)
          render_success(BotConfigSerializer.new(bot_config).call)
        else
          render_errors(bot_config.errors.full_messages)
        end
      end

      private

      def set_restaurant
        @restaurant = current_user.restaurants.find(params[:restaurant_id])
      rescue ActiveRecord::RecordNotFound
        render_error('Restaurant not found.', status: :not_found)
      end

      def bot_config_params
        params.require(:bot_config).permit(
          :menu,
          :delivery_info,
          :deals,
          :rules,
          :tone,
          :mascot_type,
          :brand_color
        )
      end
    end
  end
end