FactoryBot.define do
  factory :restaurant do
    name          { 'Pizza Palace' }
    phone         { '01700-123456' }
    location      { '123 Main St, Dhaka' }
    opening_hours { '11am - 11pm daily' }
    association :user
  end
end