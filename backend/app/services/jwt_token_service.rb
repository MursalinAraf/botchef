class JwtTokenService
  def self.call(user)
    new(user).call
  end

  def initialize(user)
    @user = user
  end

  def call
    Warden::JWTAuth::UserEncoder.new.call(
      @user,
      @user.class,
      nil
    ).first
  end
end