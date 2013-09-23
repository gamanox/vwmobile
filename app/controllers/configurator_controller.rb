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
      @subcategory = Subcategory.find(params[:id])
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

  def package
    @car = Car.find(params[:car_id])
    @version = Version.find(params[:version_id])
    @transmission = Transmission.find(params[:transmission_id])
    @color = Color.find(params[:color_id])
    @interior = Interior.find(params[:sid])
    @packages = Package.all
    render layout:false
  end

  def service
    @car = Car.find(params[:car_id])
    @version = Version.find(params[:version_id])
    @transmission = Transmission.find(params[:transmission_id])
    @color = Color.find(params[:color_id])
    @interior = Interior.find(params[:interior_id])
    
    @package_id_str = ""
    if(params[:sid])
      @packages = Package.find(params[:sid])
      @packages.each do |p| 
          @package_id_str += "&package_id[]="+p.id.to_s
      end
    end
    @services = Service.all
    render layout:false
  end
  def review
    @car = Car.find(params[:car_id])
    @version = Version.find(params[:version_id])
    # @transmission = Transmission.find(params[:transmission_id])
    # @color = Color.find(params[:color_id])
    # @interior = Interior.find(params[:interior_id])
    
    # @package_id_str = ""
    
    #if(params[:package_id])
    #  @packages = Package.find(params[:package_id])
    #  @packages.each do |p| 
    #      @package_id_str += "&package_id[]="+p.id.to_s
    #  end
    #end
    
    # @service_id_str = ""
    #if(params[:sid])
    #  @services = Service.find(params[:sid])
    #  @services.each do |s| 
    #      @service_id_str += "&service_id[]="+s.id.to_s
    #  end
    #end
    render layout:false
  end

  def search
    q = "%#{params[:q]}%".downcase
  #  @versions = Car.includes(:versions).where("cars.name like ? OR versions.name like ?",q,q)
   @versions = Car.find_by_sql("SELECT versions.*, cars.name as car_name FROM cars INNER JOIN versions ON versions.car_id = cars.id WHERE lower(cars.name) LIKE '#{q}' OR lower(versions.name) LIKE '#{q}' LIMIT 10")
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
