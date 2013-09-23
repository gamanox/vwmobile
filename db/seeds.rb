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

cars = Car.create([
	{name:'Nuevo Polo GTI',subcategory_id:1,list_price: 460900},
	{name:'Golf GTI',subcategory_id:1,list_price: 460900},
	{name:'The Beetle',subcategory_id:1,list_price: 460900},
	{name:'CrossFox',subcategory_id:2,list_price: 460900},
	{name:'Jetta',subcategory_id:2,list_price: 460900},
	{name:'Gol',subcategory_id:3,list_price: 460900},
	{name:'Polo',subcategory_id:3,list_price: 460900},
	{name:'Gol Sedan',subcategory_id:3,list_price: 460900},
	{name:'Golf',subcategory_id:4,list_price: 460900},
	{name:'Clasico',subcategory_id:4,list_price: 460900},
	{name:'Golf SW',subcategory_id:4,list_price: 460900},
	{name:'Volkswagen CC',subcategory_id:5,list_price: 460900},
	{name:'Passat',subcategory_id:5,list_price: 460900},
	{name:'Tiguan',subcategory_id:6,list_price: 460900},
	{name:'Touareg',subcategory_id:6,list_price: 460900},
	{name:'Touareg Edition X',subcategory_id:6,list_price: 460900}])

versions = Version.create([
		{name: 'Sport Style 1.4a',description:'Suspensión delantera y trasera, A/C con temperatura independiente en dos zonas, volante multifunciones en piel con calefacción, paletas de cambios y más', car_id:1,list_price: 460900},
		{name: 'Sport Style 1.4b',description:'Suspensión delantera y trasera, A/C con temperatura independiente en dos zonas, volante multifunciones en piel con calefacción, paletas de cambios y más', car_id:1,list_price: 460900},
		{name: 'Sport Style 1.4c',description:'Suspensión delantera y trasera, A/C con temperatura independiente en dos zonas, volante multifunciones en piel con calefacción, paletas de cambios y más', car_id:1,list_price: 460900},
		{name: 'Sport Style 1.4d',description:'Suspensión delantera y trasera, A/C con temperatura independiente en dos zonas, volante multifunciones en piel con calefacción, paletas de cambios y más', car_id:2,list_price: 460900},
		{name: 'Sport Style 1.4e',description:'Suspensión delantera y trasera, A/C con temperatura independiente en dos zonas, volante multifunciones en piel con calefacción, paletas de cambios y más', car_id:2,list_price: 460900},
		{name: 'Sport Style 1.4f',description:'Suspensión delantera y trasera, A/C con temperatura independiente en dos zonas, volante multifunciones en piel con calefacción, paletas de cambios y más', car_id:3,list_price: 460900}
	])

transmissions = Transmission.create([
		{name: 'DSG',description:'Diseñado para evitar el kickdown que gasta tanto combustible',price_up:1.2},
		{name: 'Tiptronic',description:'Para los que no les gusta manual',price_up:1.1},
		{name: 'Manual',description:'Para los que no le gusta automático',price_up:1.0}
	])

colors = Color.create([
		{name:'Marrón Dakar',hex:'#F00',description:'Colores siempre vivos y resistentes',price_up:1.0},
		{name:'Negro Oscuro',hex:'#000',description:'Colores siempre vivos y resistentes',price_up:1.2},
		{name:'Blanco Sinchiste',hex:'#FFF',description:'Colores siempre vivos y resistentes',price_up:1.1},
		{name:'Azul Árbol',hex:'#00F',description:'Colores siempre vivos y resistentes',price_up:1.0},
		{name:'Verde Cielo',hex:'#0F0',description:'Colores siempre vivos y resistentes',price_up:1.0}
	])

interiors = Interior.create([
		{name:'Tela Pakata',description:'Asientos térmicos que no se calientan con el sol',price_up:1.0},
		{name:'Piel Manatí',description:'Asientos térmicos que no se calientan con el sol',price_up:1.0}
	])

packages = Package.create([
		{name:'Navegación',description:'Para que no te pierdas para ir al OXXO',price_up:1.05},
		{name:'Blindaje',description:'Para espantar cholos',price_up:1.10},
		{name:'Luces de Neón',description:'Para ser el más envidiado de la colonia',price_up:1.08}

	])

services = Service.create([
		{name:'Garantía extendida 4 años',description:'Cubre todo, hasta cuando lo maneja tu abuelita',price_up:1.1},
		{name:'Garantía extendida 2 años',description:'Seguro contra huracanes y maestros del CNTE',price_up:1.2}
])