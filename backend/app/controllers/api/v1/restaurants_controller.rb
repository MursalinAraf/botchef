module Api
  module V1
    class RestaurantsController < Api::ApplicationController
      include Api::Renderable

      before_action :authenticate_user!
      before_action :set_restaurant, only: [:show, :update, :destroy]

      # GET /api/v1/restaurants
        def index
          render_success(RestaurantSerializer.collection(current_user.restaurants))
        end

      # GET /api/v1/restaurants/:id
      def show
        render_success(RestaurantSerializer.new(@restaurant).call)
      end

      # POST /api/v1/restaurants
      def create
        restaurant = current_user.restaurants.build(restaurant_params)

        if restaurant.save
          render_success(RestaurantSerializer.new(restaurant).call, :created)
        else
          render_errors(restaurant.errors.full_messages)
        end
      end

      # PATCH /api/v1/restaurants/:id
      def update
        if @restaurant.update(restaurant_params)
          render_success(RestaurantSerializer.new(@restaurant).call)
        else
          render_errors(@restaurant.errors.full_messages)
        end
      end

      # DELETE /api/v1/restaurants/:id
      def destroy
        @restaurant.destroy
        render_success({})
      end

      private

      def set_restaurant
        @restaurant = current_user.restaurants.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render_error('Restaurant not found.', status: :not_found)
      end

      def restaurant_params
        params.require(:restaurant).permit(
          :name,
          :phone,
          :location,
          :opening_hours
        )
      end
    end
  end
end