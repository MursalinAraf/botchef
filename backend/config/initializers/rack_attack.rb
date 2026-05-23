Rack::Attack.throttle('login/ip', limit: 5, period: 60) do |req|
  req.ip if req.path == '/api/v1/auth/login' && req.post?
end

Rack::Attack.throttle('signup/ip', limit: 3, period: 60) do |req|
  req.ip if req.path == '/api/v1/auth/signup' && req.post?
end

Rack::Attack.throttle('chat/ip', limit: 30, period: 60) do |req|
  req.ip if req.path.match?(%r{/api/v1/restaurants/[^/]+/chats}) && req.post?
end

Rack::Attack.throttle('public_api/ip', limit: 60, period: 60) do |req|
  req.ip if req.path.start_with?('/api/v1/public/')
end

Rack::Attack.throttled_responder = lambda do |_req|
  [429, { 'Content-Type' => 'application/json' }, [{ error: 'Too many requests. Please slow down.' }.to_json]]
end
