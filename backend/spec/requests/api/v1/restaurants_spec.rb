require 'rails_helper'

RSpec.describe 'Api::V1::Restaurants', type: :request do
  let(:user) { create(:user) }
  let(:auth_headers) { auth_headers_for(user) }

  describe 'GET /api/v1/restaurants' do
    context 'when authenticated' do
      before do
        create_list(:restaurant, 3, user: user)
        get '/api/v1/restaurants', headers: auth_headers
      end

      it 'returns http 200' do
        expect(response).to have_http_status(:ok)
      end

      it 'returns all restaurants for current user' do
        expect(json.length).to eq(3)
      end

      it 'returns correct fields' do
        expect(json.first.keys).to include('id', 'name', 'phone', 'location', 'opening_hours')
      end
    end

    context 'when unauthenticated' do
      before { get '/api/v1/restaurants' }

      it 'returns http 401' do
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'GET /api/v1/restaurants/:id' do
    let(:restaurant) { create(:restaurant, user: user) }

    context 'when authenticated' do
      before { get "/api/v1/restaurants/#{restaurant.id}", headers: auth_headers }

      it 'returns http 200' do
        expect(response).to have_http_status(:ok)
      end

      it 'returns correct restaurant' do
        expect(json['name']).to eq(restaurant.name)
      end
    end

    context 'when restaurant belongs to another user' do
      let(:other_restaurant) { create(:restaurant) }

      before { get "/api/v1/restaurants/#{other_restaurant.id}", headers: auth_headers }

      it 'returns http 404' do
        expect(response).to have_http_status(:not_found)
      end
    end

    context 'when unauthenticated' do
      before { get "/api/v1/restaurants/#{restaurant.id}" }

      it 'returns http 401' do
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'POST /api/v1/restaurants' do
    let(:valid_params) do
      {
        restaurant: {
          name: 'New Restaurant',
          phone: '01700-999999',
          location: 'Dhaka',
          opening_hours: '10am - 10pm'
        }
      }
    end

    let(:invalid_params) do
      {
        restaurant: {
          name: '',
          phone: '',
          location: '',
          opening_hours: ''
        }
      }
    end

    context 'with valid params' do
      before { post '/api/v1/restaurants', params: valid_params, headers: auth_headers }

      it 'returns http 201' do
        expect(response).to have_http_status(:created)
      end

      it 'creates a new restaurant' do
        expect(Restaurant.count).to eq(1)
      end

      it 'returns correct restaurant' do
        expect(json['name']).to eq('New Restaurant')
      end
    end

    context 'with invalid params' do
      before { post '/api/v1/restaurants', params: invalid_params, headers: auth_headers }

      it 'returns http 422' do
        expect(response).to have_http_status(:unprocessable_entity)
      end

      it 'returns errors' do
        expect(json['errors']).to be_present
      end
    end

    context 'when unauthenticated' do
      before { post '/api/v1/restaurants', params: valid_params }

      it 'returns http 401' do
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'PATCH /api/v1/restaurants/:id' do
    let(:restaurant) { create(:restaurant, user: user) }

    context 'with valid params' do
      before do
        patch "/api/v1/restaurants/#{restaurant.id}",
          params: { restaurant: { name: 'Updated Name' } },
          headers: auth_headers
      end

      it 'returns http 200' do
        expect(response).to have_http_status(:ok)
      end

      it 'updates the restaurant' do
        expect(json['name']).to eq('Updated Name')
      end
    end

    context 'when restaurant belongs to another user' do
      let(:other_restaurant) { create(:restaurant) }

      before do
        patch "/api/v1/restaurants/#{other_restaurant.id}",
          params: { restaurant: { name: 'Updated Name' } },
          headers: auth_headers
      end

      it 'returns http 404' do
        expect(response).to have_http_status(:not_found)
      end
    end
  end

  describe 'DELETE /api/v1/restaurants/:id' do
    let(:restaurant) { create(:restaurant, user: user) }

    context 'when authenticated' do
      before { delete "/api/v1/restaurants/#{restaurant.id}", headers: auth_headers }

      it 'returns http 200' do
        expect(response).to have_http_status(:ok)
      end

      it 'deletes the restaurant' do
        expect(Restaurant.count).to eq(0)
      end
    end

    context 'when restaurant belongs to another user' do
      let(:other_restaurant) { create(:restaurant) }

      before { delete "/api/v1/restaurants/#{other_restaurant.id}", headers: auth_headers }

      it 'returns http 404' do
        expect(response).to have_http_status(:not_found)
      end
    end
  end

  def json
    JSON.parse(response.body)
  end
end