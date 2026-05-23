# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Api::V1::Public::Restaurants', type: :request do
  describe 'GET /api/v1/public/restaurants/:id' do
    let(:restaurant) { create(:restaurant) }

    context 'without any auth token' do
      before { get "/api/v1/public/restaurants/#{restaurant.id}" }

      it 'returns http 200' do
        expect(response).to have_http_status(:ok)
      end

      it 'returns the required restaurant fields' do
        expect(json.keys).to include('id', 'name', 'phone', 'location', 'opening_hours')
      end

      it 'returns correct field values' do
        expect(json).to include('name' => restaurant.name, 'phone' => restaurant.phone,
                                'location' => restaurant.location)
      end

      it 'returns null bot_config when none is configured' do
        expect(json['bot_config']).to be_nil
      end
    end

    context 'when a bot config exists' do
      let!(:bot_config) { create(:bot_config, restaurant: restaurant) }
      let(:expected_bot_config) do
        { 'tone' => 'friendly', 'mascot_type' => 'pizza', 'brand_color' => bot_config.brand_color,
          'menu' => bot_config.menu, 'delivery_info' => bot_config.delivery_info, 'deals' => bot_config.deals }
      end

      before { get "/api/v1/public/restaurants/#{restaurant.id}" }

      it 'returns bot_config with widget fields' do
        expect(json['bot_config']).to include(expected_bot_config)
      end

      it 'does not expose rules in bot_config' do
        expect(json['bot_config']).not_to have_key('rules')
      end
    end

    context 'when the restaurant does not exist' do
      before { get '/api/v1/public/restaurants/0' }

      it 'returns http 404' do
        expect(response).to have_http_status(:not_found)
      end
    end
  end
end
