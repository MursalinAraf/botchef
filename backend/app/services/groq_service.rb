require 'net/http'
require 'json'

class GroqService
  API_URL       = 'https://api.groq.com/openai/v1/chat/completions'.freeze
  MODEL         = 'llama-3.3-70b-versatile'.freeze
  MOCK_RESPONSE = 'This is a mock response. Please add GROQ_API_KEY to your .env file to enable real AI responses.'.freeze

  def self.call(system_prompt:, messages:)
    new(system_prompt: system_prompt, messages: messages).call
  end

  def initialize(system_prompt:, messages:)
    @system_prompt = system_prompt
    @messages      = messages
  end

  def call
    return MOCK_RESPONSE if ENV['GROQ_API_KEY'].blank?

    uri  = URI(API_URL)
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true

    request                  = Net::HTTP::Post.new(uri)
    request['Content-Type']  = 'application/json'
    request['Authorization'] = "Bearer #{ENV['GROQ_API_KEY']}"
    request.body = {
      model:    MODEL,
      messages: [{ role: 'system', content: @system_prompt }, *@messages]
    }.to_json

    response = http.request(request)
    parsed   = JSON.parse(response.body)

    unless response.is_a?(Net::HTTPSuccess)
      raise "Groq API error: #{parsed.dig('error', 'message') || response.code}"
    end

    parsed.dig('choices', 0, 'message', 'content')
  end
end
