# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Api::V1::Public::Chats', type: :request do
  let(:restaurant)     { create(:restaurant) }
  let(:valid_messages) { [{ role: 'user', content: 'What is on the menu?' }] }
  let(:ai_response)    { 'We have Margherita and BBQ Chicken!' }

  before { allow(GroqService).to receive(:call).and_return(ai_response) }

  describe 'POST /api/v1/public/restaurants/:restaurant_id/chats' do
    context 'without any auth token' do
      before do
        create(:bot_config, restaurant: restaurant)
        post "/api/v1/public/restaurants/#{restaurant.id}/chats",
             params: { messages: valid_messages }
      end

      it 'returns http 200' do
        expect(response).to have_http_status(:ok)
      end

      it 'returns the AI response text' do
        expect(json['response']).to eq(ai_response)
      end

      it 'calls GroqService with a system prompt and messages' do
        expect(GroqService).to have_received(:call).with(
          system_prompt: a_kind_of(String),
          messages: a_kind_of(Array)
        )
      end
    end

    context 'when bot_config is missing' do
      before do
        post "/api/v1/public/restaurants/#{restaurant.id}/chats",
             params: { messages: valid_messages }
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
        post "/api/v1/public/restaurants/#{restaurant.id}/chats",
             params: { messages: [] }
      end

      it 'returns http 422' do
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end

    context 'when messages param is missing' do
      before do
        create(:bot_config, restaurant: restaurant)
        post "/api/v1/public/restaurants/#{restaurant.id}/chats", params: {}
      end

      it 'returns http 422' do
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end

    context 'when the restaurant does not exist' do
      before do
        post '/api/v1/public/restaurants/0/chats',
             params: { messages: valid_messages }
      end

      it 'returns http 404' do
        expect(response).to have_http_status(:not_found)
      end
    end

    context 'when history exceeds MAX_HISTORY (20)' do
      let(:long_history) do
        (1..25).map { |i| { role: i.odd? ? 'user' : 'assistant', content: "Message #{i}" } }
      end

      before do
        create(:bot_config, restaurant: restaurant)
        post "/api/v1/public/restaurants/#{restaurant.id}/chats",
             params: { messages: long_history }
      end

      it 'returns http 200' do
        expect(response).to have_http_status(:ok)
      end

      it 'truncates messages to the last 20' do
        expect(GroqService).to have_received(:call).with(
          hash_including(messages: have_attributes(length: 20))
        )
      end
    end
  end
end
