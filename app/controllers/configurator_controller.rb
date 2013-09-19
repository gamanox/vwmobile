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
    @versions = Version.all
    render layout:false
  end

  def transmission
    @car = Car.find(params[:car_id])
    @version = Version.find(params[:sid])
    @transmissions = Transmission.all
    render layout:false
  end

  def color
     @car = Car.find(params[:car_id])
    @version = Version.find(params[:version_id])
    @transmission = Transmission.find(params[:sid])
    @colors = Color.all
    render layout:false
  end

  def interior
    @car = Car.find(params[:car_id])
    @version = Version.find(params[:version_id])
    @transmission = Transmission.find(params[:transmission_id])
    @color = Color.find(params[:sid])
    @interiors = Interior.all
    render layout:false
  end

  def empty
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
