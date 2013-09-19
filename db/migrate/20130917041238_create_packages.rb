class CreatePackages < ActiveRecord::Migration
  def change
    create_table :packages do |t|
      t.string :name
      t.text :description
      t.float :price_up

      t.timestamps
    end
  end
end
