require 'rails_helper'

RSpec.describe 'Api::V1::Auth::Registrations', type: :request do
  describe 'POST /api/v1/auth/signup' do
    let(:valid_params) do
      {
        user: {
          first_name: 'Ahmed',
          last_name: 'Rahman',
          email: 'ahmed@example.com',
          password: 'password123',
          password_confirmation: 'password123'
        }
      }
    end

    let(:invalid_params) do
      {
        user: {
          first_name: '',
          last_name: '',
          email: 'not-an-email',
          password: '123',
          password_confirmation: '456'
        }
      }
    end

    context 'with valid params' do
      before { post '/api/v1/auth/signup', params: valid_params }

      it 'returns http 201' do
        expect(response).to have_http_status(:created)
      end

      it 'returns user data' do
        expect(json['user']['email']).to eq('ahmed@example.com')
        expect(json['user']['first_name']).to eq('Ahmed')
        expect(json['user']['last_name']).to eq('Rahman')
        expect(json['user']['role']).to eq('user')
      end

      it 'does not return password' do
        expect(json['user']).not_to have_key('encrypted_password')
        expect(json['user']).not_to have_key('password')
      end

      it 'creates a new user in the database' do
        expect(User.count).to eq(1)
      end

      it 'returns a JWT token in the header' do
        expect(response.headers['Authorization']).to be_present
      end
    end

    context 'with invalid params' do
      before { post '/api/v1/auth/signup', params: invalid_params }

      it 'returns http 422' do
        expect(response).to have_http_status(:unprocessable_entity)
      end

      it 'returns error messages' do
        expect(json['errors']).to be_present
      end

      it 'does not create a user' do
        expect(User.count).to eq(0)
      end
    end

    context 'with duplicate email' do
      before do
        post '/api/v1/auth/signup', params: valid_params
        post '/api/v1/auth/signup', params: valid_params
      end

      it 'returns http 422' do
        expect(response).to have_http_status(:unprocessable_entity)
      end

      it 'returns email taken error' do
        expect(json['errors']).to include('Email has already been taken')
      end
    end
  end
end