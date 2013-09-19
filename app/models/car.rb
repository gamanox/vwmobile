class Car < ActiveRecord::Base
	belongs_to :subcategory
	
	has_many :car_models
end
