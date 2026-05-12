class InvitationSerializer
  def self.call(resource)
    new(resource).call
  end

  def initialize(invitation)
    @invitation = invitation
  end

  def call
    {
      id:          @invitation.id,
      email:       @invitation.email,
      token:       @invitation.token,
      accepted:    @invitation.accepted?,
      expired:     @invitation.expired?,
      accepted_at: @invitation.accepted_at,
      expires_at:  @invitation.expires_at,
      invited_by:  UserSerializer.new(@invitation.invited_by).call
    }
  end
end
