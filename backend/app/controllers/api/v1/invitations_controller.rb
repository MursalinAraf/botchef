module Api
  module V1
    class InvitationsController < Api::ApplicationController
      include Api::Renderable

      skip_before_action :authenticate_user!, only: [:show, :accept]
      before_action :require_admin!, only: [:create]
      before_action :set_invitation_by_token, only: [:show, :accept]

      # POST /api/v1/invitations
      def create
        invitation = Invitation.new(email: params.dig(:invitation, :email), invited_by: current_user)

        if invitation.save
          InvitationMailer.invite(invitation).deliver_later
          render_success(InvitationSerializer.new(invitation).call, :created)
        else
          render_errors(invitation.errors.full_messages)
        end
      end

      # GET /api/v1/invitations/:token
      def show
        render_success(InvitationSerializer.new(@invitation).call)
      end

      # POST /api/v1/invitations/:token/accept
      def accept
        unless @invitation.pending?
          message = @invitation.accepted? ? 'Invitation has already been accepted.' : 'Invitation has expired.'
          return render_error(message, status: :unprocessable_entity)
        end

        user = User.new(
          email:                 @invitation.email,
          first_name:            accept_params[:first_name],
          last_name:             accept_params[:last_name],
          password:              accept_params[:password],
          password_confirmation: accept_params[:password_confirmation],
          role:                  :admin
        )

        if user.save
          @invitation.update!(accepted_at: Time.current)
          token = Warden::JWTAuth::UserEncoder.new.call(user, :user, nil).first
          render_success({ token: token, user: UserSerializer.new(user).call }, :created)
        else
          render_errors(user.errors.full_messages)
        end
      end

      private

      def set_invitation_by_token
        @invitation = Invitation.find_by(token: params[:token])
        render_error('Invitation not found.', status: :not_found) unless @invitation
      end

      def require_admin!
        render_error('Forbidden.', status: :forbidden) unless current_user&.admin?
      end

      def accept_params
        params.require(:user).permit(:first_name, :last_name, :password, :password_confirmation)
      end
    end
  end
end
