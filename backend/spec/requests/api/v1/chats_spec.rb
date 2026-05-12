require 'rails_helper'

RSpec.describe 'Api::V1::Chats', type: :request do
  let(:user)        { create(:user) }
  let(:other_user)  { create(:user) }
  let(:restaurant)  { create(:restaurant, user: user) }
  let(:auth_headers) { auth_headers_for(user) }

  let(:valid_messages) { [{ role: 'user', content: 'What is on the menu?' }] }
  let(:ai_response)    { 'We have Margherita and BBQ Chicken!' }

  before do
    allow(AnthropicService).to receive(:call).and_return(ai_response)
  end

  describe 'POST /api/v1/restaurants/:restaurant_id/chats' do
    context 'with valid request' do
      before do
        create(:bot_config, restaurant: restaurant)
        post "/api/v1/restaurants/#{restaurant.id}/chats",
             params: { messages: valid_messages },
             headers: auth_headers
      end

      it 'returns http 200' do
        expect(response).to have_http_status(:ok)
      end

      it 'returns the AI response text' do
        expect(json['response']).to eq(ai_response)
      end

      it 'calls AnthropicService with a system prompt and messages' do
        expect(AnthropicService).to have_received(:call).with(
          system_prompt: a_kind_of(String),
          messages:      a_kind_of(Array)
        )
      end

      it 'includes restaurant name in the system prompt' do
        expect(AnthropicService).to have_received(:call).with(
          hash_including(system_prompt: include(restaurant.name))
        )
      end
    end

    context 'when bot_config is missing' do
      before do
        post "/api/v1/restaurants/#{restaurant.id}/chats",
             params: { messages: valid_messages },
             headers: auth_headers
      end

      it 'returns http 422' do
        expect(response).to have_http_status(:unprocessable_entity)
      end

      it 'returns a bot-related error message' do
        expect(json['error']).to include('bot')
      end
    end

    context 'when messages is an empty array' do
      before do
        create(:bot_config, restaurant: restaurant)
        post "/api/v1/restaurants/#{restaurant.id}/chats",
             params: { messages: [] },
             headers: auth_headers
      end

      it 'returns http 422' do
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end

    context 'when messages param is missing' do
      before do
        create(:bot_config, restaurant: restaurant)
        post "/api/v1/restaurants/#{restaurant.id}/chats",
             params: {},
             headers: auth_headers
      end

      it 'returns http 422' do
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end

    context 'when history exceeds MAX_HISTORY (20)' do
      let(:long_history) do
        (1..25).map { |i| { role: i.odd? ? 'user' : 'assistant', content: "Message #{i}" } }
      end

      before do
        create(:bot_config, restaurant: restaurant)
        post "/api/v1/restaurants/#{restaurant.id}/chats",
             params: { messages: long_history },
             headers: auth_headers
      end

      it 'returns http 200' do
        expect(response).to have_http_status(:ok)
      end

      it 'truncates messages to the last 20' do
        expect(AnthropicService).to have_received(:call).with(
          hash_including(messages: have_attributes(length: 20))
        )
      end
    end

    context 'when unauthenticated' do
      before do
        post "/api/v1/restaurants/#{restaurant.id}/chats",
             params: { messages: valid_messages }
      end

      it 'returns http 401' do
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'when restaurant belongs to another user' do
      let(:other_restaurant) { create(:restaurant, user: other_user) }

      before do
        post "/api/v1/restaurants/#{other_restaurant.id}/chats",
             params: { messages: valid_messages },
             headers: auth_headers
      end

      it 'returns http 404' do
        expect(response).to have_http_status(:not_found)
      end
    end
  end
end
