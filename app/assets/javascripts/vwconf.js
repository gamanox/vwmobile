var config_data;
var currentPage = null;
var prevPage;
var level = 0;

$(function () {
	$.getJSON('/configurator/data.json',init);
});


function init(data) {
	config_data = data;
	$(window).on("resize",setScreen);
	$(".prevPage").hide();
	$(".nextPage").hide();
	var History = window.History;
	History.Adapter.bind(window,'statechange',stateHasChanged);

	setScreen();
	loadPage("category");
}

function setScreen() {
	console.log($(".currentPage").height());
	var height = $(window).height()-49;
	if(height < $(".currentPage").height()) {
		height = $(".currentPage").height();
	}
	$("#content").animate({"height":height});
}

function loadPage(page) {
	console.log("LOAD PAGE: "+page);
	prevPage = currentPage
	currentPage = page;
	
	History.pushState({"level":level,"page":page,"url":"/configurator/"+page},"VW Conf Mobile");
	
	
}
function switchScreen(){
	var prev = $(".prevPage");
	var current = $(".currentPage");
	var next = $(".nextPage");
	$(current).animate({left:-$(window).width()},250).hide(0).removeClass("currentPage").addClass("prevPage");
	$(next).css("left",$(window).width()).show().animate({left:0},250).removeClass("nextPage").addClass("currentPage");
	$(prev).removeClass("prevPage").addClass("nextPage");
	enableButtons();
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
	setScreen();

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
	}
	if(action == "back") {
		History.back();
	}

}
function stateHasChanged() { // Note: We are using statechange instead of popstate
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