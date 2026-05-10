class Invitation < ApplicationRecord
  belongs_to :invited_by, class_name: 'User', foreign_key: 'invited_by_id'

  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i

  validates :email,      presence: true, format: { with: VALID_EMAIL_REGEX }
  validates :token,      presence: true, uniqueness: true
  validates :expires_at, presence: true

  before_validation :set_defaults, on: :create

  def expired?
    expires_at < Time.current
  end

  def accepted?
    accepted_at.present?
  end

  def pending?
    !accepted? && !expired?
  end

  private

  def set_defaults
    self.token      ||= SecureRandom.urlsafe_base64(32)
    self.expires_at ||= 7.days.from_now
  end
end
