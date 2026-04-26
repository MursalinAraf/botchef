class CreateBotConfigs < ActiveRecord::Migration[7.2]
  def change
    create_table :bot_configs do |t|
      t.text    :menu,          null: false
      t.text    :delivery_info
      t.text    :deals
      t.text    :rules
      t.integer :tone,          null: false, default: 0
      t.integer :mascot_type,   null: false, default: 0
      t.string  :brand_color,   null: false, default: '#059669'
      t.references :restaurant, null: false, foreign_key: true

      t.timestamps
    end
  end
end