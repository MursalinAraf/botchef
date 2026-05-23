class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: JwtDenylist

  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i

  enum :role, { user: 0, admin: 1 }

  has_many :restaurants, dependent: :destroy

  validates :first_name, presence: true, length: { maximum: 50 }
  validates :last_name,  presence: true, length: { maximum: 50 }
  validates :email,      presence: true, format: { with: VALID_EMAIL_REGEX }
  validates :role,       presence: true

  before_save :downcase_email

  def generate_refresh_token!
    self.refresh_token = SecureRandom.urlsafe_base64(32)
    save!(validate: false)
    refresh_token
  end

  def invalidate_refresh_token!
    update_column(:refresh_token, nil)
  end

  private

  def downcase_email
    self.email = email.downcase
  end
end
