require 'rails_helper'

RSpec.describe 'Api::V1::Health', type: :request do
  describe 'GET /api/v1/health' do
    before { get '/api/v1/health' }

    it 'returns http 200' do
      expect(response).to have_http_status(:ok)
    end

    it 'returns status ok' do
      expect(json['status']).to eq('ok')
    end

    it 'returns correct version' do
      expect(json['version']).to eq('v1')
    end

    it 'returns current environment' do
      expect(json['environment']).to eq('test')
    end

    it 'returns a timestamp' do
      expect(json['timestamp']).to be_present
    end
  end

  private

  def json
    JSON.parse(response.body)
  end
end
