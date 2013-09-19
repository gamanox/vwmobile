class CreateTransmissions < ActiveRecord::Migration
  def change
    create_table :transmissions do |t|
      t.string :name
      t.text :description
      t.float :price_up

      t.timestamps
    end
  end
end
