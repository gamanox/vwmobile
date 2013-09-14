# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
categories = Category.create([{name:'Deportivo'},
	{name:'Familiar'},
	{name:'De Lujo'}])

subcategories = Subcategory.create([{name:'2 Puertas',category_id:1},
	{name:'4 Puertas',category_id:1},
	{name:'Compacto',category_id:2},
	{name:'Mediano',category_id:2},
	{name:'Sedan',category_id:3},
	{name:'SUV',category_id:3}])

cars = Car.create([{name:'Nuevo Polo GTI',subcategory_id:1},
	{name:'Golf GTI',subcategory_id:1},
	{name:'The Beetle',subcategory_id:1},
	{name:'CrossFox',subcategory_id:2},
	{name:'Jetta',subcategory_id:2},
	{name:'Gol',subcategory_id:3},
	{name:'Polo',subcategory_id:3},
	{name:'Gol Sedan',subcategory_id:3},
	{name:'Golf',subcategory_id:4},
	{name:'Clasico',subcategory_id:4},
	{name:'Golf SW',subcategory_id:4},
	{name:'Volkswagen CC',subcategory_id:5},
	{name:'Passat',subcategory_id:5},
	{name:'Tiguan',subcategory_id:6},
	{name:'Touareg',subcategory_id:6},
	{name:'Touareg Edition X',subcategory_id:6}])

