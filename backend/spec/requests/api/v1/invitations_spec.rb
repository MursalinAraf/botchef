require 'rails_helper'

RSpec.describe 'Api::V1::Invitations', type: :request do
  let(:admin)        { create(:user, role: :admin) }
  let(:regular_user) { create(:user, role: :user) }
  let(:admin_headers) { auth_headers_for(admin) }
  let(:user_headers)  { auth_headers_for(regular_user) }

  describe 'POST /api/v1/invitations' do
    let(:params) { { invitation: { email: 'new@example.com' } } }

    context 'when authenticated as admin' do
      it 'creates an invitation and returns 201' do
        post '/api/v1/invitations', params: params, headers: admin_headers
        expect(response).to have_http_status(:created)
      end

      it 'returns the invitation payload' do
        post '/api/v1/invitations', params: params, headers: admin_headers
        expect(json['email']).to eq('new@example.com')
        expect(json['token']).to be_present
        expect(json['accepted']).to be false
        expect(json['expired']).to be false
      end

      it 'enqueues a mailer job' do
        expect {
          post '/api/v1/invitations', params: params, headers: admin_headers
        }.to have_enqueued_mail(InvitationMailer, :invite)
      end

      context 'with invalid email' do
        it 'returns 422' do
          post '/api/v1/invitations', params: { invitation: { email: 'not-an-email' } }, headers: admin_headers
          expect(response).to have_http_status(:unprocessable_entity)
        end
      end
    end

    context 'when authenticated as regular user' do
      it 'returns 403' do
        post '/api/v1/invitations', params: params, headers: user_headers
        expect(response).to have_http_status(:forbidden)
      end
    end

    context 'when unauthenticated' do
      it 'returns 401' do
        post '/api/v1/invitations', params: params
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'GET /api/v1/invitations/:token' do
    let(:invitation) { create(:invitation) }

    context 'with a valid token' do
      before { get "/api/v1/invitations/#{invitation.token}" }

      it 'returns 200' do
        expect(response).to have_http_status(:ok)
      end

      it 'returns invitation details' do
        expect(json['email']).to eq(invitation.email)
        expect(json['token']).to eq(invitation.token)
        expect(json['accepted']).to be false
        expect(json['expired']).to be false
      end
    end

    context 'with an invalid token' do
      before { get '/api/v1/invitations/nonexistent_token' }

      it 'returns 404' do
        expect(response).to have_http_status(:not_found)
      end
    end
  end

  describe 'POST /api/v1/invitations/:token/accept' do
    let(:invitation) { create(:invitation) }
    let(:accept_params) do
      {
        user: {
          first_name:            'New',
          last_name:             'Admin',
          password:              'password123',
          password_confirmation: 'password123'
        }
      }
    end

    context 'with a valid pending invitation' do
      before { post "/api/v1/invitations/#{invitation.token}/accept", params: accept_params }

      it 'returns 201' do
        expect(response).to have_http_status(:created)
      end

      it 'returns a JWT token and user' do
        expect(json['token']).to be_present
        expect(json['user']['email']).to eq(invitation.email)
        expect(json['user']['role']).to eq('admin')
      end

      it 'marks the invitation as accepted' do
        expect(invitation.reload.accepted?).to be true
      end

      it 'creates a user with admin role' do
        user = User.find_by(email: invitation.email)
        expect(user).to be_present
        expect(user.admin?).to be true
      end
    end

    context 'with an expired invitation' do
      let(:invitation) { create(:invitation, :expired) }

      before { post "/api/v1/invitations/#{invitation.token}/accept", params: accept_params }

      it 'returns 422' do
        expect(response).to have_http_status(:unprocessable_entity)
      end

      it 'returns an expiry error' do
        expect(json['error']).to match(/expired/i)
      end
    end

    context 'with an already accepted invitation' do
      let(:invitation) { create(:invitation, :accepted) }

      before { post "/api/v1/invitations/#{invitation.token}/accept", params: accept_params }

      it 'returns 422' do
        expect(response).to have_http_status(:unprocessable_entity)
      end

      it 'returns an already accepted error' do
        expect(json['error']).to match(/already been accepted/i)
      end
    end

    context 'with invalid user params' do
      let(:bad_params) { { user: { first_name: '', last_name: '', password: 'short', password_confirmation: 'mismatch' } } }

      before { post "/api/v1/invitations/#{invitation.token}/accept", params: bad_params }

      it 'returns 422' do
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end

    context 'with an invalid token' do
      before { post '/api/v1/invitations/bad_token/accept', params: accept_params }

      it 'returns 404' do
        expect(response).to have_http_status(:not_found)
      end
    end
  end
end
