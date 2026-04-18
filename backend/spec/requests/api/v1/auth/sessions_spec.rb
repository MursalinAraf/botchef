require 'rails_helper'

RSpec.describe 'Api::V1::Auth::Sessions', type: :request do
  let(:user) do
    User.create!(
      first_name: 'Ahmed',
      last_name: 'Rahman',
      email: 'ahmed@example.com',
      password: 'password123',
      password_confirmation: 'password123'
    )
  end

  describe 'POST /api/v1/auth/login' do
    context 'with valid credentials' do
      before do
        post '/api/v1/auth/login', params: {
          user: { email: user.email, password: 'password123' }
        }
      end

      it 'returns http 200' do
        expect(response).to have_http_status(:ok)
      end

      it 'returns user data' do
        expect(json['user']['email']).to eq('ahmed@example.com')
        expect(json['user']['role']).to eq('user')
      end

      it 'returns a JWT token in the header' do
        expect(response.headers['Authorization']).to be_present
      end
    end

    context 'with invalid credentials' do
      before do
        post '/api/v1/auth/login', params: {
          user: { email: user.email, password: 'wrongpassword' }
        }
      end

      it 'returns http 401' do
        expect(response).to have_http_status(:unauthorized)
      end

      it 'does not return a token' do
        expect(response.headers['Authorization']).to be_nil
      end
    end
  end

  describe 'DELETE /api/v1/auth/logout' do
    context 'with valid token' do
      let(:token) do
        post '/api/v1/auth/login', params: {
          user: { email: user.email, password: 'password123' }
        }
        response.headers['Authorization']
      end

      before do
        delete '/api/v1/auth/logout', headers: {
          'Authorization' => token
        }
      end

      it 'returns http 200' do
        expect(response).to have_http_status(:ok)
      end
    end

    context 'without token' do
      before { delete '/api/v1/auth/logout' }

      it 'returns http 401' do
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  private

  def json
    JSON.parse(response.body)
  end
end