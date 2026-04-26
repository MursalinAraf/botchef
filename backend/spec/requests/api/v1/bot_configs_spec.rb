require 'rails_helper'

RSpec.describe 'Api::V1::BotConfigs', type: :request do
  let(:user) { create(:user) }
  let(:auth_headers) { auth_headers_for(user) }
  let(:restaurant) { create(:restaurant, user: user) }

  describe 'GET /api/v1/restaurants/:restaurant_id/bot_config' do
    context 'when bot_config exists' do
      before do
        create(:bot_config, restaurant: restaurant)
        get "/api/v1/restaurants/#{restaurant.id}/bot_config", headers: auth_headers
      end

      it 'returns http 200' do
        expect(response).to have_http_status(:ok)
      end

      it 'returns correct fields' do
        expect(json.keys).to include('menu', 'tone', 'mascot_type', 'brand_color')
      end
    end

    context 'when bot_config does not exist' do
      before { get "/api/v1/restaurants/#{restaurant.id}/bot_config", headers: auth_headers }

      it 'returns http 404' do
        expect(response).to have_http_status(:not_found)
      end
    end

    context 'when unauthenticated' do
      before { get "/api/v1/restaurants/#{restaurant.id}/bot_config" }

      it 'returns http 401' do
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'PUT /api/v1/restaurants/:restaurant_id/bot_config/upsert' do
    let(:valid_params) do
      {
        bot_config: {
          menu: 'Margherita - 350tk',
          tone: 'friendly',
          mascot_type: 'pizza',
          brand_color: '#059669'
        }
      }
    end

    context 'when bot_config does not exist — creates new' do
      before do
        put "/api/v1/restaurants/#{restaurant.id}/bot_config/upsert",
          params: valid_params,
          headers: auth_headers
      end

      it 'returns http 200' do
        expect(response).to have_http_status(:ok)
      end

      it 'creates bot_config' do
        expect(BotConfig.count).to eq(1)
      end

      it 'returns correct data' do
        expect(json['menu']).to eq('Margherita - 350tk')
      end
    end

    context 'when bot_config exists — updates' do
      before do
        create(:bot_config, restaurant: restaurant)
        put "/api/v1/restaurants/#{restaurant.id}/bot_config/upsert",
          params: { bot_config: { menu: 'Updated menu' } },
          headers: auth_headers
      end

      it 'returns http 200' do
        expect(response).to have_http_status(:ok)
      end

      it 'updates bot_config' do
        expect(json['menu']).to eq('Updated menu')
      end

      it 'does not create duplicate' do
        expect(BotConfig.count).to eq(1)
      end
    end

    context 'with invalid params' do
      before do
        put "/api/v1/restaurants/#{restaurant.id}/bot_config/upsert",
          params: { bot_config: { menu: '', brand_color: 'invalid' } },
          headers: auth_headers
      end

      it 'returns http 422' do
        expect(response).to have_http_status(:unprocessable_entity)
      end

      it 'returns errors' do
        expect(json['errors']).to be_present
      end
    end

    context 'when unauthenticated' do
      before do
        put "/api/v1/restaurants/#{restaurant.id}/bot_config/upsert",
          params: valid_params
      end

      it 'returns http 401' do
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  def json
    JSON.parse(response.body)
  end
end