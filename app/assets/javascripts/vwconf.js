var config_data; //No se usa
var currentPage = null; //Pagina actual
var prevPage; //Pagina anterior
var level = 0; //Cantidad de veces que ha avanzado en el historial
var previousState; //No se usa
var newPage;

var currentSlide; //Slide actual

var isDragging = false;

$(init); //Arranca

//Stack de páginas, una forma simple de saber el recorrido entre páginas
var pages = new Array();

/*
	Inicia el configurador
	1. arranca el listener de resize de la pantalla
	2. activa todos los botones (clase btn)
	3. activa el input de busqueda
	4. desactiva los links del footer (son controlados por la clase btn)
	5. oculta las páginas previas y siguientes
	6. activa el listener de cambio de historial
	7. acomoda la pantalla
	8. carga la primera pantalla (si en el url viene el nombre del carro, carga sus versiones, si no, las categorias)
*/
function init(data) {
	$(window).on("resize",setScreen);
	$(".btn").on("click",doAction);
	$("#search input").on("keyup",doSearch);
	$("#footer a").on("click",disableLink);
	$(".prevPage").hide();
	$(".nextPage").hide();
	$("#slider_btn").on("vmousedown",startDrag);
	//$("#slider_btn").on("touchstart",startDrag);
	$("body").on("vmouseup",stopDrag);
	//$(window).on("touchend",stopDrag);
	//$(window).on("touchmove".moveSliderT);
	var History = window.History;
	History.Adapter.bind(window,'statechange',stateHasChanged);

	setScreen();
	if(car.length > 0) {
		loadPage("version/?id="+car[0].id);
	} else {
		loadPage("category");
	}
}
var historyTimer;

/*
	deshabilitador de links (a)
*/

function disableLink(e) {
	e.preventDefault();
}

function startDrag() {
	console.log("start drag");
	isDragging = true;
	$("body").on("vmousemove",moveSlider);
	//$(window).on("touchmove",moveSliderT);
}
function stopDrag() {
	
	if(isDragging){
		console.log("stop drag");
		$("body").off("vmousemove",moveSlider);
		//$(window).off("touchmove",moveSliderT);
		isDragging = false;
	}
}
function moveSliderT(e) {
	console.log(e.touches[0]);
	//$("#slider_btn").css("left",e.touches[0].pageX);
	//moveSlider(e.touches[0]);
}
function moveSlider(e) {
	var x = e.pageX-75;
	x = x < 20 ? 20:x;
	x = x > 230 ? 230:x;
	var r = x-20;
	r = Math.floor(r/15);
	r = 20+r*5;
	$("#slider_btn").css("left",x).html(r+"%").attr("range",r);
}

/*
	ajusta la pantalla
	acomoda la altura del contenido (image_slider en la mayoria de los casos) NOTA: quizá ya no es necesario
	anima el bloque de #content para ajustarse al contenido (como consecuencia reposiciona el footer)
*/

function setScreen() {
	$(".currentPage .image_slider").height(getMaxSlideHeight());
	console.log($(".currentPage").height());
	//var height = $(window).height()-49;
	//if(height < $(".currentPage").height()) {
		height = $(".currentPage").height();
	//}
	$("#content").animate({"height":height});
	//$("#wrapper").height($(window).height());
}

/*
	obtiene la altura máxima del contenido (cuando son slides, eg: versiones, color, etc)
*/

function getMaxSlideHeight() {
	var max = 0;
	$(".currentPage .image_slider > ul > li").each(function (index,element) {
		max = $(element).height() > max ? $(element).height():max;
	});
	return max;
}

/*
	Manda a cargar una página
	Lo hace metiendo un estado en el historial, cuando el evento de stateChange se dispara, carga mediante ajax la página
	historyTimer es usado para forzar la carga, por alguna razón en ocasiones al cargar la primera vez no llama al evento stateChange
	el timer hace que cargue la página sin usar ese evento.

*/

function loadPage(page,withURL) {
	console.log("LOAD PAGE: "+page);
	currentState = History.getState();
	prevPage = currentPage
	currentPage = page;
	historyTimer = window.setTimeout('forceLoad("/configurator/'+page+'")',1000);
	console.log("INIT TIMEOUT");
	History.pushState({"level":level,"page":page,"url":"/configurator/"+page},"Volkswagen México - Configurador de autos Volkswagen",withURL);		
}

/*
	Si el evento stateChange no es llamado (despues de 1 segundo), carga desde aqui la página mediante ajax
*/
function forceLoad(page) {
	historyTimer = null;
	console.log("Force Load");
	pages.push(page);
	$(".nextPage").load(page,switchScreen);

}

/*
	cada que teclea el usuario en el buscador, carga mediante ajax los resultados
*/
function doSearch() {
	console.log("SEARCH: "+$(this).val().length);

	if($(this).val().length > 2) {
		$("#search_results").load("/configurator/search/?q="+encodeURIComponent($(this).val()),function () {
			$("#search .btn").on("click",doAction);
		});
	} else {
		$("#search_results").html("");
	}
}
/*
	realiza la transición entre pantallas hacia la izquierda
	mueve la currentPage y nextPage a la izquierda
	reajusta los nombres (clases) para la siguiente llamada a esta función
	llama a la funcion enableButtons que habilita todos los botones de la página
	llama a la funcion enableSlider que habilita el slider del contenido
	llama a la funcion setScreen que ajusta el contenido de la pantalla
*/
function switchScreen(){
	var prev = $(".prevPage");
	var current = $(".currentPage");
	var next = $(".nextPage");
	$(current).animate({left:-$(window).width()},250).hide(0).removeClass("currentPage").addClass("prevPage");
	$(next).css("left",$(window).width()).show().animate({left:0},250).removeClass("nextPage").addClass("currentPage");
	$(prev).removeClass("prevPage").addClass("nextPage");
	enableButtons();
	enableSlider();
	window.setTimeout(setScreen,250);

}

/*
	realiza la transición entre pantallas hacia la derecha
	mueve la currentPage y prevPage a la derecha
	reajusta los nombres (clases) para la siguiente llamada a esta función
	llama a la funcion enableButtons que habilita todos los botones de la página
	llama a la funcion enableSlider que habilita el slider del contenido
	llama a la funcion setScreen que ajusta el contenido de la pantalla
*/
function switchBackScreen(){
	var prev = $(".prevPage");
	var current = $(".currentPage");
	var next = $(".nextPage");
	$(current).animate({left:$(window).width()},250).hide(0).removeClass("currentPage").addClass("nextPage");
	$(prev).css("left",-$(window).width()).show().animate({left:0},250).removeClass("prevPage").addClass("currentPage");
	$(next).removeClass("nextPage").addClass("prevPage");
	enableButtons();
	enableSlider();
	window.setTimeout(setScreen,250);

}

/*
	habilita los botones izq y der del slider
	habilita y ajusta el contador de slides
*/
function enableSlider() {
	$(".currentPage .arrows").off("swipeleft");
	$(".currentPage .arrows").off("swiperight");
	$(".currentPage .image_slider").off("swipeleft");
	$(".currentPage .image_slider").off("swiperight");
	console.log("ULW: "+$(".currentPage .navcount ul").width());
	$(".currentPage .navcount").css("margin-left",$(".currentPage .navcount li").length*-6);

	$(".currentPage .image_slider > ul > li").each(function(index,element) {
		$(element).css("left",index*$(window).width()).hide();
	});
	$($(".currentPage .image_slider > ul > li").get(0)).show();

	if($(".currentPage .image_slider > ul > li").length < 2) {
		$(".currentPage .arrows").hide();
	} else {
		$(".currentPage .arrows").show();
		$(".currentPage .image_slider").on("swipeleft",nextSlide);
		$(".currentPage .image_slider").on("swiperight",prevSlide);
		$(".currentPage .arrows").on("swipeleft",nextSlide);
		$(".currentPage .arrows").on("swiperight",prevSlide);
	}
	currentSlide = 0;
	$($(".currentPage .navcount li").get(currentSlide)).removeClass("off").addClass("on");
}
/*
	Habilita los botones (todo elemento con clase 'btn') que se encuentre dentro de la página actual

*/
function enableButtons() {

	$(".prevPage .btn").off("click",doAction);
	$(".nextPage .btn").off("click",doAction);
	$(".currentPage .btn").on("click",doAction);
}

/*
	Evento al darle clic a algun elemento con clase 'btn'
	Todos los elementos tienen atributo 'action', algunos tienen atributos extras que fungen como parámetros
	ejecuta alguna accion dependiendo del valor en el atributo 'action'
*/

function doAction() {
	var action = $(this).attr("action");
	var param;
	/*
		Manda a llamar alguna página (definida en 'actionid')
		oculta el submenu o el buscador en caso que esten activos
	*/
	if(action == "page") {
		param = $(this).attr("actionid");
		addReview($(this).attr("review"),$(this).attr("reviewname"));
		toggleReview(true);
		toggleSubmenu(true);
		toggleSearch(true);
		$("#end_btn").attr("actionid",param);
		loadPage(param);
		return;

	/*
		Manda a llamar alguna página (definida en 'actionid') y cambia el url del navegador (definida en 'url')
		oculta el submenu o el buscador en caso que esten activos
	*/
	} else if(action == "pagewurl") {
		param = $(this).attr("actionid");
		var url = $(this).attr("url");
		addReview($(this).attr("review"),$(this).attr("reviewname"));
		toggleSubmenu(true);
		toggleSearch(true);
		toggleReview(true);
		$("#end_btn").attr("actionid",param);
		$("html, body").animate({ scrollTop: "49px" },250);
		loadPage(param,url);
		return;
	/*
		Regresa en la historia
	*/
	}else if(action == "back") {
		History.back();
		return;
	/*
		Regresa en la historia
		Valida el regreso (si se cumple la condición de que la página anterior sea 'actionid'), si no, se va al principio
		Este es principalmente cuando desde el url te lleva directamente al review o a algun carro
	*/
	} else if(action == "backcheck") {
		param = $(this).attr("actionid");
		console.log("BACK CHECK");
		console.log(pages[pages.length-2]);
		if(pages.length >= 2 && pages[pages.length-2].split("/")[0] == param)
			History.back();
		else {
			loadPage("category","./");
		}
		return;
	/*
		Se mueve al siguiente slide
	*/
	} else if(action == "next_slide") {
		nextSlide();
		return;
	/*
		Se mueve al previo slide
	*/
	} else if(action == "prev_slide") {
		prevSlide();
		return;
	/*
		Carga una página, enviando de parámetro el id del slide actual (para cuando se escoge versión, color, interior, etc)
	*/
	} else if(action == "page_slide") {
		param = $(this).attr("actionid");
		var slide = $(".currentPage .image_slider > ul > li").get(currentSlide);
		param += "&sid="+$(slide).attr("sid")*1;
		addReview($(this).attr("review"),$(slide).attr("name"));
		$("#end_btn").attr("actionid",param);
		toggleReview(true);
		toggleSubmenu(true);
		toggleSearch(true);
		$("html, body").animate({ scrollTop: "49px" },250);
		loadPage(param);
	
	} else if(action == "review_slide") {
		param = $(this).attr("actionid");
		var slide = $(".currentPage .image_slider > ul > li").get(currentSlide);
		param += "&sid="+$(slide).attr("sid")*1;
		addReview($(this).attr("review"),$(slide).attr("name"));
		if($(this).attr("review") == "version") {
			$("#simulator_content .page_title .cname").html($(slide).attr("cname"));
			$("#simulator_content .page_title .vname").html($(slide).attr("vname"));
		}
		$("#end_btn").attr("actionid",param);
		toggleReview(false);
		toggleSubmenu(true);
		toggleSearch(true);
	}
	else if(action == "select") {
		/*
		Selecciona un paquete o servicio
	*/
		param = $(this).attr("actionid");
		var on = $(this).find(".on");
		var off = $(this).find(".off");
		var text = on.length > 0 ? "Agregar":"Remover";
		$(this).find(".center").html(text);
		on.removeClass("on").addClass("off");
		off.removeClass("off").addClass("on");
	/*
		Carga una página, enviando de parámetro los id del paquete o servicio seleccionado
	*/
	} else if(action == "page_slide_select") {
		param = $(this).attr("actionid");
		var selected = "";
		var sid;
		var names = "";
		var on;
		$(".currentPage .image_slider > ul > li").each(function (index,element) {
			on = $(element).find(".on");
			if(on.length > 0 ){
				sid = $(element).attr("sid")*1;
				selected += "&sid[]="+sid;
				names += " "+$(element).attr("name");
			}
		});
		param += selected;
		addReview($(this).attr("review"),names);
		$("#end_btn").attr("actionid",param);
		$("html, body").animate({ scrollTop: "49px" },250);
		loadPage(param);
	
	} else if(action == "review_select") {
		param = $(this).attr("actionid");
		var selected = "";
		var sid;
		var names = "";
		var on;
		$(".currentPage .image_slider > ul > li").each(function (index,element) {
			on = $(element).find(".on");
			if(on.length > 0 ){
				sid = $(element).attr("sid")*1;
				selected += "&sid[]="+sid;
				names += " "+$(element).attr("name");
			}
		});
		param += selected;
		addReview($(this).attr("review"),names);
		$("#end_btn").attr("actionid",param);
		toggleReview(false);
		toggleSubmenu(true);
		toggleSearch(true);
	
	}
	else if(action == "submenu") {
		/*
		muestra el submenu, oculta el buscador en caso que esté activo
	*/
		toggleSearch(true);
		toggleReview(true);
		toggleSubmenu($("#submenu").is(":visible"));
	/*
		muestra el buscador, oculta el submenu en caso que esté activo
	*/
	} else if(action == "search") {

		toggleSubmenu(true);
		toggleReview(true);
		toggleSearch($("#search").is(":visible"));
	/*
		muestra el dropdown que se encuentra en la barra de precios (resumen de las características seleccionados)
	*/
	} else if(action == "show_prices") {
		togglePrices();
	/*
		Lleva a alguna liga (usada en los links del footer) en ventana nueva
	*/
	} else if(action == "link") {
		param = $(this).attr("actionid");
		window.open(param);
	} else if(action == "hide_review") {
		toggleReview(true);
	} else if(action == "attention") {

		toggleAttention($("#attention").is(":visible"));
	} else if(action == "simulator") {

		toggleSimulator($("#simulator").is(":visible"));
	}
	 else if(action == "form_submit") {
		param = $(this).attr("actionid");
		submitForm(param);
	} else if(action == "expand_sim") {
		toggleSimOption(this.parentNode);
	} else if(action == "option_sel") {
		var current = $("#"+$(this).attr("actionid"));
		var next = $(current).next();
		if($(next).attr("id") == "sim_slider") {
			next = $(next).next();
		}
		$(current).find("div").removeClass("selected");
		$(this).find("div").addClass("selected");
		$(next).find(".sim_title, .nbtn").addClass("btn");
		$(next).find(".btn").off("click",doAction).on("click",doAction);
		//$(next).find(".nbtn").addClass("expand_btn");
		$(current).find(".sim_title").html($(this).html());
		toggleSimOption(current);
		toggleSimOption(next);
	} else if(action =="do_sim") {
		//TODO SIMULAR
	} else if(action == "new_sim") {
		console.log("new sim");
		$("#simulator_content").find(".expand_btn").removeClass("btn").removeClass("on").off("click",doAction);
		$("#simulator_content").find(".sim_title").removeClass("btn").off("click",doAction);
		$("#simulator_content .sim_options").animate({height:0},250)
		$("#simulator_content .sim_options").find("div").removeClass("selected");
		$("#regimen_fiscal .expand_btn").addClass("btn").on("click",doAction);
		$("#regimen_fiscal .sim_title").addClass("btn").on("click",doAction);
		$("#simulator_content .sim_title").each(function (index,element) {
			$(element).html($(element).attr("dtitle"));
		});
		$("#slider_btn").css("left",20).html("20%").attr("range",20);
			//TODO CLEAR VALUES
	}

}

function submitForm(form_id) {
	var form = $("#"+form_id);
	var valid = true;
	$("#"+form_id+" input").each(function(index,element) {
		var li = element.parentNode.parentNode.parentNode;
		console.log($(element).attr("r"));
		console.log($(element).attr("r") == "yes");
		console.log($(element).val() == "");
		if($(element).attr("r") == "yes" && $(element).val() == "") {
			$(li).addClass("error");
			valid = false;
		} else {
			$(li).removeClass("error");
		}
	});
	if(valid) {
		//SUBMIT FORM
		$("#attention_content").hide();
		$("#attention_thanks").fadeIn();
	}
	
}

function addReview(review,value) {
	$("#review_list ."+review).html(value);
}

function toggleSimOption(node) {
	console.log(node);
	var options = $(node).find(".sim_options");
	if($(options).height() > 0) {
		$(options).animate({height:0},250);
		$(node).find(".expand_btn").removeClass("on");
	} else {
		var h = $(options).find("ul").height();
		console.log("H: "+h);
		$(options).animate({height:h},250);
		$(node).find(".expand_btn").addClass("on");
	}
}

function toggleAttention(hide) {
	if(hide) {
		$("#attention").fadeOut();
	} else {
		var newh = $("#content").height()+285+49;
		$("#attention").css("min-height",newh);
		$("#attention").fadeIn();
	}
	$("html, body").animate({ scrollTop: "0px" },300);
}

function toggleSimulator(hide) {
	if(hide) {
		$("#simulator").fadeOut();
	} else {
		var newh = $("#content").height()+285+49;
		$("#simulator").css("min-height",newh);
		$("#simulator").fadeIn();
	}
	$("html, body").animate({ scrollTop: "0px" },300);
}

function toggleReview(hide) {
	if(hide) {
		$("#review_list").fadeOut();
	} else {
		var newh = $("#content").height()+285;
		$("#review_list .dimmer").width($(window).width()).height(newh);
		$("#review_list").fadeIn();
		$("html, body").animate({ scrollTop: "49px" },300);
	}
	
}

/*
	Muestra u oculta el resumen de las características seleccionadas (dropdown de la barra de precios)
	Lo hace de forma animada
	Oscurece el fondo
*/
function togglePrices() {
	var slides = $(".currentPage .image_slider > ul > li");
	var slide = $(slides).get(currentSlide);
	if($(slide).find(".price_list").height() > 0 ) {

		$(slide).find(".price_btn").removeClass("open");
		$(slide).find(".price_list").delay(250).animate({height:0},250);
		$(slide).find(".slider_prices .dimmer").animate({height:0,opacity:0},250);
	} else {
		var h = $(slide).find(" .price_list ul").height();
		console.log("H: "+h)
		$(slide).find(" .price_btn").addClass("open");
		$(slide).find(" .price_list").animate({height:h},250);
		h = $("#content").height()+285-h-50-41;
		console.log("DH: "+h);
		$(slide).find(".slider_prices .dimmer").animate({height:h,opacity:0.75},250);
	}
}

/*
	Muestra u oculta el buscador
	Lo hace de forma animada
	Oscurece el fondo
*/
function toggleSearch(hide) {
	if(hide){
		$("#search").delay(250).animate({height:0},250).hide(0);
		$("#search .dimmer").fadeTo(1,0.75).animate({opacity:0},250);
	} else {
		$("#search").css("height",0).show().animate({height:56},250);
		var newh = $("#wrapper").height() < $(window).height() ? $(window).height()-49:$("#wrapper").height();
		$("#search .dimmer").fadeTo(1,0).height($("#wrapper").height()).delay(250).animate({height:newh-56,opacity:0.75},250);
	}
}

/*
	Muestra u oculta el submenu
	Lo hace de forma animada
	Oscurece el fondo
*/
function toggleSubmenu(hide) {
	if(hide){
		$("#submenu").delay(250).animate({height:0},250).hide(0);
		$("#submenu .dimmer").fadeTo(1,0.75).animate({opacity:0},250);
	} else {
		console.log("WrH: "+$("#wrapper").height());
		console.log("WiH: "+$(window).height());
		console.log("CH: "+$("#content").height());
		$("#submenu").css("height",0).show().animate({height:150},250);
		var newh = $("#wrapper").height() < $(window).height() ? $(window).height()-49:$("#wrapper").height();
		$("#submenu .dimmer").fadeTo(1,0).height($("#wrapper").height()).delay(250).animate({height:newh-150,opacity:0.75},250);
	}
}

/*
	Genera la transición entre slides mueve hacia la derecha
	Guarda en currentSlide el nuevo slide visible
	Si se encuentra en el primer slide, se mueve al último
*/
function prevSlide() {
	var prev = currentSlide-1;
		var slides = $(".currentPage .image_slider > ul > li");
		if(prev < 0) {
			prev = $(slides).length-1;
		}
		$($(slides).get(currentSlide)).animate({"left":$(window).width()},250).hide(0);
		$($(slides).get(prev)).css("left",-$(window).width()).show().animate({left:0},250);
		$($(".currentPage .navcount li").get(currentSlide)).removeClass("on").addClass("off");
		currentSlide = prev;
		$($(".currentPage .navcount li").get(currentSlide)).removeClass("off").addClass("on");
}

/*
	Genera la transición entre slides mueve hacia la izquierda
	Guarda en currentSlide el nuevo slide visible
	Si se encuentra en el último slide, se mueve al primero
*/
function nextSlide() {
	var next = currentSlide+1;
		var slides = $(".currentPage .image_slider > ul > li");
		if(next >= $(slides).length) {
			next = 0;
		}
		$($(slides).get(currentSlide)).animate({"left":-$(window).width()},250).hide(0);
		$($(slides).get(next)).css("left",$(window).width()).show().animate({left:0},250);
		$($(".currentPage .navcount li").get(currentSlide)).removeClass("on").addClass("off");
		currentSlide = next;
		$($(".currentPage .navcount li").get(currentSlide)).removeClass("off").addClass("on");
}

/*
	Evento de historial
	Cuando ocurre un evento en la historia, carga mediante ajax una página nueva (la que se encuentre en el historial)
	En el State viene un objeto con varios parámetros:
	data.page - página a cargar
	data.level - nivel del historial (cuantas veces ha avanzado en la historia)
	data.url - url real de la página que va a carga con ajax

*/
function stateHasChanged() { // Note: We are using statechange instead of popstate
		console.log("CLEAR TIMEOUT");

		window.clearTimeout(historyTimer);
		historyTimer = null;
        console.log("State has changed");
        var State = History.getState(); // Note: We are using History.getState() instead of event.state
    	console.log(State);
    	console.log(State.data.level+" - "+level);

    	/*
    		Level es la cantidad de páginas metidas en la historia, 
    		cuando es nulo es no hay páginas en la historia, recarga entonces todo el sitio
    	*/
    	if(State.data.level == undefined) {
    		window.location.href = "/";
    	}
    	/*
			Cuando level es menor, quiere decir que se está regresando
			Carga la página anterior, la mete en el contenedor .prevPage, posteriormente hará la transición para presentarlo (switchBackScreen)
			Saca del stack de páginas
    	*/
    	if(State.data.level < level) {
    		level--;
    		pages.pop();
    		$(".prevPage").load(State.data.url,switchBackScreen);
    	/*
			Cuando level es mayor, quiere decir que se está avanzado
			Carga la página siguiente,la mete en el contenedor .nextPage, posteriormente hará la transición para presentarlo (switchScreen)
			Mete al stack de páginas la nueva página
    	*/
    	} else {
    		level++;
    		pages.push(State.data.page);
    		$(".nextPage").load(State.data.url,switchScreen);
    	}
    
}