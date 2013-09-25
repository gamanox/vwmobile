VWMobile::Application.routes.draw do
  get "configurator/empty"
  get "configurator/price"


  #index es el único elemento que muestra la página completa (head, etc), todas las demás solo cargan su contenido interno (view)
  get "configurator/index"

  get "configurator/data"
  get "configurator/category"
  get "configurator/subcategory"
  get "configurator/car"
  get "configurator/version"
  get "configurator/transmission"
  get "configurator/color"
  get "configurator/interior"
  get "configurator/package"
  get "configurator/service"
  get "configurator/review"
  get "configurator/search"
  get "configurator/tusvw"

  #el controlador por default (y unico es configurator)

  get "configurator/" => "configurator#index"
  get "configurator/:name" => "configurator#index"

  #para cuando el url trae el nombre del carro

  get "/:name" => "configurator#index"

  #
  root "configurator#index"
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end
  
  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
