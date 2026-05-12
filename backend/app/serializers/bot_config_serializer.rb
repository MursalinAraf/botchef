class BotConfigSerializer
  def self.call(resource)
    new(resource).call
  end

  def initialize(bot_config)
    @bot_config = bot_config
  end

  def call
    {
      id: @bot_config.id,
      menu: @bot_config.menu,
      delivery_info: @bot_config.delivery_info,
      deals: @bot_config.deals,
      rules: @bot_config.rules,
      tone: @bot_config.tone,
      mascot_type: @bot_config.mascot_type,
      brand_color: @bot_config.brand_color
    }
  end
end