class Car < ActiveRecord::Base
	belongs_to :subcategory
	
	has_many :versions
end
