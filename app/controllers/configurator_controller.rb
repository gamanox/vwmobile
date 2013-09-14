class ConfiguratorController < ApplicationController
  def category
  	@categories = Category.all
    render layout:false
  end

  def subcategory
  	if(params[:id].to_i > 0) 

      @category = Category.find(params[:id])
	  	@subcategories = Subcategory.where(category_id:params[:id])
	  else 
	 	   @subcategories = Subcategory.all
	 end
   render layout:false
  end

  def car
  	if(params[:id].to_i > 0)
  		@cars = Car.where(subcategory_id:params[:id])
  	else
  		@cars = Car.all
  	end
    render layout:false
  end
  def version
    @car = Car.find(params[:id])
    render layout:false
  end

  def transmission
    @car = Car.find(params[:id])
    render layout:false
  end

  def color
  end

  def price
  end

  def data
  	@cars = Car.all
  	@subcategories = Subcategory.all
  	@categories = Category.all
  	render json: {cars:@cars,subcategories:@subcategories,categories:@categories}
  	
  end
  def index
  end
end
