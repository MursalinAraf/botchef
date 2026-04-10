FactoryBot.define do
  factory :jwt_denylist do
    jti { "MyString" }
    exp { "2026-04-11 00:30:53" }
  end
end
