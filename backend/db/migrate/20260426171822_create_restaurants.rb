class CreateRestaurants < ActiveRecord::Migration[7.2]
  def change
    create_table :restaurants do |t|
      t.string :name, null: false
      t.string :phone, null: false
      t.string :location, null: false
      t.string :opening_hours, null: false
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
