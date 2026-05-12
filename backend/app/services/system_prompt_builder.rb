class SystemPromptBuilder
  def self.call(restaurant:, bot_config:)
    new(restaurant: restaurant, bot_config: bot_config).call
  end

  def initialize(restaurant:, bot_config:)
    @restaurant = restaurant
    @bot_config = bot_config
  end

  def call
    parts = []

    parts << "You are a helpful AI assistant for #{@restaurant.name}, a restaurant."
    parts << "Location: #{@restaurant.location}"
    parts << "Phone: #{@restaurant.phone}"
    parts << "Opening Hours: #{@restaurant.opening_hours}"
    parts << "\nMenu:\n#{@bot_config.menu}" if @bot_config.menu.present?
    parts << "\nDelivery Info:\n#{@bot_config.delivery_info}" if @bot_config.delivery_info.present?
    parts << "\nDeals & Promotions:\n#{@bot_config.deals}" if @bot_config.deals.present?
    parts << "\nBehavior Rules:\n#{@bot_config.rules}" if @bot_config.rules.present?
    parts << "\n#{tone_instruction}"
    parts << 'Only answer questions related to this restaurant. Keep responses helpful and concise.'

    parts.join("\n")
  end

  private

  def tone_instruction
    case @bot_config.tone
    when 'friendly' then 'Respond in a warm, friendly, and welcoming tone.'
    when 'formal'   then 'Respond in a professional and formal tone.'
    when 'fun'      then 'Respond in a fun, upbeat, and playful tone.'
    when 'concise'  then 'Keep responses brief and to the point.'
    else                 'Respond in a helpful tone.'
    end
  end
end
