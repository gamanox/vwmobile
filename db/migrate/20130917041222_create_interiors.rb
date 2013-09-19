class CreateInteriors < ActiveRecord::Migration
  def change
    create_table :interiors do |t|
      t.string :name
      t.text :description
      t.float :price_up

      t.timestamps
    end
  end
end
