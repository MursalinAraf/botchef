class UserSerializer
  def self.call(resource)
    new(resource).call
  end

  def initialize(user)
    @user = user
  end

  def call
    {
      id: @user.id,
      first_name: @user.first_name,
      last_name: @user.last_name,
      email: @user.email,
      role: @user.role
    }
  end
end