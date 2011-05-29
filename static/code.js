var tablet = true;
var socket =  new io.Socket();/*(null, {transportOptions: {
				'xhr-polling': {
				timeout: 3000
				},
				'jsonp-polling': {
				timeout: 3000
				}
				}});*/
socket.on('disconnect', function () {
    //alert("server lost");
    $("body").append("<p>lost</p>");
});
socket.on('message', function (data) {
    // alert(data);
});
$(function () {
    socket.connect();
});


function link (href) {
    //var href = $(this).attr("href");
    if(/http/.exec(href)) { alert("This opens external web page: "+href); return false; }
    $("#contentParent").load(href + " #content");
    var background = /pages\/.*\.html/.exec(href) ? href.replace(/\/pages\/(.*)\.html/, "/static/backgrounds/$1.jpg") : "/static/backgrounds/default.jpg";
    if(tablet) $("#background").css("background", 'url("'+background+'") fixed -240px 32px');
    $(document).scrollTop(0);
    return false;
}

$(function () {
    $("a").live('click', function () {
	return link($(this).attr("href"));
    });

    if($(window).height()*$(window).width() > 400000)	tablet = false;

    if(tablet) {
	//	alert("tablet");
	var base_scroll = $("#base").css("position", "absolute");
	$(window).scroll(function () {
	    base_scroll.css("top", document.body.scrollTop);
	});
	$(document).scrollTop(0);
    }else{
	$("#background").css("background", 'url("/static/backgrounds/default.jpg") 0px -32px');
	$("#nav").css("background", '#404040');
    }
});


for(var i=0;i<20;i++)
    location.hash=i;
location.hash="";