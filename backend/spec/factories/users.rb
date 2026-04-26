FactoryBot.define do
  factory :user do
    first_name { 'Ahmed' }
    last_name  { 'Rahman' }
    sequence(:email) { |n| "user#{n}@example.com" }
    password   { 'password123' }
    password_confirmation { 'password123' }
    role { :user }
  end
end