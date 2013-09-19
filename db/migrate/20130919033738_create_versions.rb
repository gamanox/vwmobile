class CreateVersions < ActiveRecord::Migration
  def change
    create_table :versions do |t|
      t.string :name
      t.string :description
      t.integer :car_id
      t.float :list_price

      t.timestamps
    end
  end
end
