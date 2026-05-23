class Restaurant < ApplicationRecord
  belongs_to :user
  has_one :bot_config, dependent: :destroy

  validates :name,          presence: true, length: { maximum: 100 }
  validates :phone,         presence: true
  validates :location,      presence: true
  validates :opening_hours, presence: true
  validates :public_token,  presence: true, uniqueness: true

  before_validation :set_public_token, on: :create

  private

  def set_public_token
    self.public_token ||= SecureRandom.urlsafe_base64(16)
  end
end
