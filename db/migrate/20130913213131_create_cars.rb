class CreateCars < ActiveRecord::Migration
  def change
    create_table :cars do |t|
      t.string :name
      t.integer :subcategory_id

      t.timestamps
    end
  end
end
