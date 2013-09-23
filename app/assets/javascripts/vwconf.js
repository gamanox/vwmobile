var config_data;
var currentPage = null;
var prevPage;
var level = 0;

$(init);


function init(data) {
	//config_data = data;
	$(window).on("resize",setScreen);
	$(".btn").on("click",doAction);
	$("#search input").on("keyup",doSearch);
	$(".prevPage").hide();
	$(".nextPage").hide();
	var History = window.History;
	History.Adapter.bind(window,'statechange',stateHasChanged);

	setScreen();
	loadPage("category");
}
var historyTimer;

function setScreen() {
	$(".currentPage .image_slider").height(getMaxSlideHeight());
	console.log($(".currentPage").height());
	//var height = $(window).height()-49;
	//if(height < $(".currentPage").height()) {
		height = $(".currentPage").height();
	//}
	$("#content").animate({"height":height});
	$("#wrapper").height($(window).height());
}

function getMaxSlideHeight() {
	var max = 0;
	$(".currentPage .image_slider > ul > li").each(function (index,element) {
		max = $(element).height() > max ? $(element).height():max;
	});
	return max;
}

function loadPage(page) {
	console.log("LOAD PAGE: "+page);
	prevPage = currentPage
	currentPage = page;
	historyTimer = window.setTimeout('forceLoad("/configurator/'+page+'")',3000);
	console.log("INIT TIMEOUT");
	History.pushState({"level":level,"page":page,"url":"/configurator/"+page},"VW Conf Mobile");
	
	
	
}
function forceLoad(page) {
	historyTimer = null;
	console.log("Force Load");
	$(".nextPage").load(page,switchScreen);

}

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
function switchScreen(){
	var prev = $(".prevPage");
	var current = $(".currentPage");
	var next = $(".nextPage");
	$(current).animate({left:-$(window).width()},250).hide(0).removeClass("currentPage").addClass("prevPage");
	$(next).css("left",$(window).width()).show().animate({left:0},250).removeClass("nextPage").addClass("currentPage");
	$(prev).removeClass("prevPage").addClass("nextPage");
	enableButtons();
	enableSlider();
	setScreen();

}
function switchBackScreen(){
	var prev = $(".prevPage");
	var current = $(".currentPage");
	var next = $(".nextPage");
	$(current).animate({left:$(window).width()},250).hide(0).removeClass("currentPage").addClass("nextPage");
	$(prev).css("left",-$(window).width()).show().animate({left:0},250).removeClass("prevPage").addClass("currentPage");
	$(next).removeClass("nextPage").addClass("prevPage");
	enableButtons();
	enableSlider();
	setScreen();

}
var currentSlide;
function enableSlider() {
	$(".currentPage .arrows").hammer().off("swipeleft");
	$(".currentPage .arrows").hammer().off("swiperight");
	$(".currentPage .image_slider").hammer().off("swipeleft");
	$(".currentPage .image_slider").hammer().off("swiperight");

	$(".currentPage .image_slider > ul > li").each(function(index,element) {
		$(element).css("left",index*$(window).width()).hide();
	});
	$($(".currentPage .image_slider > ul > li").get(0)).show();

	if($(".currentPage .image_slider > ul > li").length < 2) {
		$(".currentPage .arrows").hide();
	} else {
		$(".currentPage .arrows").show();
		$(".currentPage .image_slider").hammer().on("swipeleft",nextSlide);
		$(".currentPage .image_slider").hammer().on("swiperight",prevSlide);
		$(".currentPage .arrows").hammer().on("swipeleft",nextSlide);
		$(".currentPage .arrows").hammer().on("swiperight",prevSlide);
	}
	currentSlide = 0;
}
function enableButtons() {

	$(".prevPage .btn").off("click",doAction);
	$(".nextPage .btn").off("click",doAction);
	$(".currentPage .btn").on("click",doAction);
}

function doAction() {
	var action = $(this).attr("action");
	var param;
	if(action == "page") {
		param = $(this).attr("actionid");
		toggleSubmenu(true);
		toggleSearch(true);
		loadPage(param);
		return;
	}
	if(action == "back") {
		History.back();
		return;
	} else if(action == "next_slide") {
		nextSlide();
		return;
	} else if(action == "prev_slide") {
		prevSlide();
		return;
	} else if(action == "page_slide") {
		param = $(this).attr("actionid");
		var slide = $(".currentPage .image_slider > ul > li").get(currentSlide);
		param += "&sid="+$(slide).attr("sid")*1;
		loadPage(param);
	}else if(action == "select") {
		param = $(this).attr("actionid");
		var on = $(this).find(".on");
		var off = $(this).find(".off");
		var text = on.length > 0 ? "Agregar":"Remover";
		$(this).find(".center").html(text);
		on.removeClass("on").addClass("off");
		off.removeClass("off").addClass("on");
	} else if(action == "page_slide_select") {
		param = $(this).attr("actionid");
		var selected = "";
		var sid;
		var on;
		$(".currentPage .image_slider > ul > li").each(function (index,element) {
			on = $(element).find(".on");
			if(on.length > 0 ){
				sid = $(element).attr("sid")*1;
				selected += "&sid[]="+sid;
			}
		});
		param += selected;
		loadPage(param);

	} else if(action == "submenu") {
		toggleSubmenu($("#submenu").is(":visible"));
	} else if(action == "search") {
		toggleSearch($("#search").is(":visible"));
	} else if(action == "show_review") {
		toggleReview();
	}

}

function toggleReview() {
	var slides = $(".currentPage .image_slider > ul > li");
	var slide = $(slides).get(currentSlide);
	if($(slide).find(".review_list").height() > 0 ) {

		$(slide).find(".price_btn").removeClass("open");
		$(slide).find(".review_list").delay(250).animate({height:0},250);
		$(slide).find(".slider_prices .dimmer").animate({height:0,opacity:0},250);
	} else {
		var h = $(slide).find(" .review_list ul").height();
		console.log("H: "+h)
		$(slide).find(" .price_btn").addClass("open");
		$(slide).find(" .review_list").animate({height:h},250);
		h = $("#content").height()+285-h-50-41;
		console.log("DH: "+h);
		$(slide).find(".slider_prices .dimmer").animate({height:h,opacity:0.75},250);
	}
}
function toggleSearch(hide) {
	if(hide){
		$("#search").delay(250).animate({height:0},250).hide(0);
		$("#search .dimmer").fadeTo(1,0.75).animate({opacity:0},250);
	} else {
		$("#search").css("height",0).show().animate({height:56},250);
		$("#search .dimmer").fadeTo(1,0).height($(window).height()-48).delay(250).animate({height:$(window).height()-104,opacity:0.75},250);
	}
}
function toggleSubmenu(hide) {
	if(hide){
		$("#submenu").delay(250).animate({height:0},250).hide(0);
		$("#submenu .dimmer").fadeTo(1,0.75).animate({opacity:0},250);
	} else {
		$("#submenu").css("height",0).show().animate({height:228},250);
		$("#submenu .dimmer").fadeTo(1,0).height($(window).height()-48).delay(250).animate({height:$(window).height()-276,opacity:0.75},250);
	}
}
function prevSlide() {
	var prev = currentSlide-1;
		var slides = $(".currentPage .image_slider > ul > li");
		if(prev < 0) {
			prev = $(slides).length-1;
		}
		$($(slides).get(currentSlide)).animate({"left":$(window).width()},250).hide(0);
		$($(slides).get(prev)).css("left",-$(window).width()).show().animate({left:0},250);
		currentSlide = prev;
}
function nextSlide() {
	var next = currentSlide+1;
		var slides = $(".currentPage .image_slider > ul > li");
		if(next >= $(slides).length) {
			next = 0;
		}
		$($(slides).get(currentSlide)).animate({"left":-$(window).width()},250).hide(0);
		$($(slides).get(next)).css("left",$(window).width()).show().animate({left:0},250);
		currentSlide = next;
}
function stateHasChanged() { // Note: We are using statechange instead of popstate
		console.log("CLEAR TIMEOUT");
		window.clearTimeout(historyTimer);
		historyTimer = null;
        console.log("State has changed");
        var State = History.getState(); // Note: We are using History.getState() instead of event.state
    	console.log(State);
    	console.log(State.data.level+" - "+level);
    	if(State.data.level == undefined) {
    		window.location.href = "/";
    	}
    	if(State.data.level < level) {
    		level--;
    		$(".prevPage").load(State.data.url,switchBackScreen);
    	} else {
    		level++;
    		$(".nextPage").load(State.data.url,switchScreen);
    	}
    
}