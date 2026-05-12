require 'net/http'
require 'json'

class AnthropicService
  API_URL       = 'https://api.anthropic.com/v1/messages'.freeze
  MODEL         = 'claude-sonnet-4-20250514'.freeze
  MAX_TOKENS    = 1024
  MOCK_RESPONSE = 'This is a mock response. Please add ANTHROPIC_API_KEY to your .env file to enable real AI responses.'.freeze

  def self.call(system_prompt:, messages:)
    new(system_prompt: system_prompt, messages: messages).call
  end

  def initialize(system_prompt:, messages:)
    @system_prompt = system_prompt
    @messages      = messages
  end

  def call
    return MOCK_RESPONSE if ENV['ANTHROPIC_API_KEY'].blank?

    uri  = URI(API_URL)
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true

    request                      = Net::HTTP::Post.new(uri)
    request['Content-Type']      = 'application/json'
    request['x-api-key']         = ENV['ANTHROPIC_API_KEY']
    request['anthropic-version'] = '2023-06-01'
    request.body = {
      model:      MODEL,
      max_tokens: MAX_TOKENS,
      system:     @system_prompt,
      messages:   @messages
    }.to_json

    response = http.request(request)
    parsed   = JSON.parse(response.body)

    unless response.is_a?(Net::HTTPSuccess)
      raise "Anthropic API error: #{parsed.dig('error', 'message') || response.code}"
    end

    parsed.dig('content', 0, 'text')
  end
end
