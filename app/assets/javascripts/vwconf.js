var config_data;
var currentPage = null;
var prevPage;
var level = 0;

$(init);


function init(data) {
	//config_data = data;
	$(window).on("resize",setScreen);
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
}

function getMaxSlideHeight() {
	var max = 0;
	$(".currentPage .image_slider li").each(function (index,element) {
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

	$(".currentPage .image_slider li").each(function(index,element) {
		$(element).css("left",index*$(window).width()).hide();
	});
	$($(".currentPage .image_slider li").get(0)).show();

	if($(".currentPage .image_slider li").length < 2) {
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
		loadPage(param);
		return;
	}
	if(action == "back") {
		History.back();
		return;
	}
	if(action == "next_slide") {
		nextSlide();
		return;
	}
	if(action == "prev_slide") {
		prevSlide();
		return;
	}
	if(action == "page_slide") {
		param = $(this).attr("actionid");
		var slide = $(".currentPage .image_slider li").get(currentSlide);
		param += "&sid="+$(slide).attr("sid")*1;
		loadPage(param);
	}

}
function prevSlide() {
	var prev = currentSlide-1;
		var slides = $(".currentPage .image_slider li");
		if(prev < 0) {
			prev = $(slides).length-1;
		}
		$($(slides).get(currentSlide)).animate({"left":$(window).width()},250).hide(0);
		$($(slides).get(prev)).css("left",-$(window).width()).show().animate({left:0},250);
		currentSlide = prev;
}
function nextSlide() {
	var next = currentSlide+1;
		var slides = $(".currentPage .image_slider li");
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