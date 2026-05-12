class UserCreationService
  def self.call(params, role: :user)
    new(params, role: role).call
  end

  def initialize(params, role: :user)
    @params = params
    @role   = role
  end

  def call
    User.new(@params.to_h.merge(role: @role))
  end
end
