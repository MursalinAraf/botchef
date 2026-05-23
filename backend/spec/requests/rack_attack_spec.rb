# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Rack::Attack throttling', type: :request do
  before do
    Rack::Attack.enabled = true
    Rack::Attack.cache.store = ActiveSupport::Cache::MemoryStore.new
  end

  after { Rack::Attack.enabled = false }

  describe 'login throttle' do
    it 'allows up to 5 requests then returns 429' do
      5.times { post '/api/v1/auth/login', params: { user: { email: 'x@x.com', password: 'wrong' } } }
      post '/api/v1/auth/login', params: { user: { email: 'x@x.com', password: 'wrong' } }
      expect(response).to have_http_status(429)
    end
  end

  describe 'signup throttle' do
    it 'allows up to 3 requests then returns 429' do
      3.times { post '/api/v1/auth/signup', params: { user: { email: 'x@x.com' } } }
      post '/api/v1/auth/signup', params: { user: { email: 'x@x.com' } }
      expect(response).to have_http_status(429)
    end
  end

  describe 'public API throttle' do
    it 'allows up to 60 requests then returns 429' do
      60.times { get '/api/v1/public/restaurants/token' }
      get '/api/v1/public/restaurants/token'
      expect(response).to have_http_status(429)
    end
  end
end
