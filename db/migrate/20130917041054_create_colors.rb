class CreateColors < ActiveRecord::Migration
  def change
    create_table :colors do |t|
      t.string :name
      t.string :hex
      t.text :description
      t.float :price_up

      t.timestamps
    end
  end
end
