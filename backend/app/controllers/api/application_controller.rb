module Api
  class ApplicationController < ActionController::API
    include Api::Renderable
    respond_to :json
  end
end
