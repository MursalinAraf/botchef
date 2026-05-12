class InvitationMailer < ApplicationMailer
  def invite(invitation)
    @invitation  = invitation
    @inviter     = invitation.invited_by
    @accept_url  = "#{ENV.fetch('FRONTEND_URL', 'http://localhost:3000')}/invite/#{invitation.token}"
    @expires_at  = invitation.expires_at.strftime('%B %d, %Y at %H:%M UTC')

    mail(
      to:      invitation.email,
      subject: "#{@inviter.first_name} #{@inviter.last_name} invited you to join BotChef"
    )
  end
end
