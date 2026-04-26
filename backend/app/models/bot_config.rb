class BotConfig < ApplicationRecord
  belongs_to :restaurant

  enum :tone, { friendly: 0, formal: 1, fun: 2, concise: 3 }

  enum :mascot_type, { pizza: 0, burger: 1, sushi: 2, curry: 3, bakery: 4, noodles: 5 }

  validates :menu, presence: true
  validates :tone,  presence: true
  validates :mascot_type, presence: true
  validates :brand_color, presence: true,
                          format: { with: /\A#[0-9a-fA-F]{6}\z/, message: 'must be a valid hex color' }
end