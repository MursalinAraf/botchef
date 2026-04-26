class Restaurant < ApplicationRecord
  belongs_to :user
  has_one :bot_config, dependent: :destroy

  validates :name,          presence: true, length: { maximum: 100 }
  validates :phone,         presence: true
  validates :location,      presence: true
  validates :opening_hours, presence: true
end