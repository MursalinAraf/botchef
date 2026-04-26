class RestaurantSerializer
  def self.collection(restaurants)
    restaurants.map { |restaurant| new(restaurant).call }
  end

  def initialize(restaurant)
    @restaurant = restaurant
  end

  def call
    {
      id: @restaurant.id,
      name: @restaurant.name,
      phone: @restaurant.phone,
      location: @restaurant.location,
      opening_hours: @restaurant.opening_hours,
      bot_config: serialized_bot_config,
      created_at: @restaurant.created_at
    }
  end

  private

  def serialized_bot_config
    return nil unless @restaurant.bot_config
    BotConfigSerializer.new(@restaurant.bot_config).call
  end
end