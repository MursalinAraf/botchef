# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Api::V1::Auth::Refresh', type: :request do
  let(:user) { create(:user) }

  describe 'POST /api/v1/auth/refresh' do
    context 'with a valid refresh token' do
      let(:refresh_token) { user.generate_refresh_token! }

      before { post '/api/v1/auth/refresh', params: { refresh_token: refresh_token } }

      it 'returns http 200' do
        expect(response).to have_http_status(:ok)
      end

      it 'returns a new access token' do
        expect(json['token']).to be_present
      end
    end

    context 'with an invalid refresh token' do
      before { post '/api/v1/auth/refresh', params: { refresh_token: 'bogus' } }

      it 'returns http 401' do
        expect(response).to have_http_status(:unauthorized)
      end

      it 'returns an error message' do
        expect(json['error']).to eq('Invalid or expired refresh token.')
      end
    end

    context 'with a missing refresh token' do
      before { post '/api/v1/auth/refresh', params: {} }

      it 'returns http 401' do
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'after the token has been invalidated by logout' do
      before do
        refresh_token = user.generate_refresh_token!
        user.invalidate_refresh_token!
        post '/api/v1/auth/refresh', params: { refresh_token: refresh_token }
      end

      it 'returns http 401' do
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end
