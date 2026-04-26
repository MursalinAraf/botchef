FactoryBot.define do
  factory :bot_config do
    menu          { 'Margherita - 350tk, BBQ Chicken - 450tk' }
    delivery_info { 'Free within 5km' }
    deals         { 'Buy 2 get 1 free' }
    rules         { 'No competitor discussion' }
    tone          { :friendly }
    mascot_type   { :pizza }
    brand_color   { '#059669' }
    association :restaurant
  end
end