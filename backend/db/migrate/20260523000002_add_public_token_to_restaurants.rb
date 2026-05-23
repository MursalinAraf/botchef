class AddPublicTokenToRestaurants < ActiveRecord::Migration[7.2]
  def up
    add_column :restaurants, :public_token, :string
    Restaurant.find_each { |r| r.update_column(:public_token, SecureRandom.urlsafe_base64(16)) }
    change_column_null :restaurants, :public_token, false
    add_index :restaurants, :public_token, unique: true
  end

  def down
    remove_index  :restaurants, :public_token
    remove_column :restaurants, :public_token
  end
end
