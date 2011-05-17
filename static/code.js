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
    alert(data);
});
$(function () {
    socket.connect();
});



$(function () {
    $("a").live('click', function () { 
	var href = $(this).attr("href");
	if(/http/.exec(href)) { alert("This open external web page: "+href); return false; }
	$("#content").load(href);
	$(document).scrollTop(0);
	return false;
    });

//    if($(window).height()*$(window).width() > 400000)	tablet = false;

    if(tablet) {
	alert("tablet");
	var base_scroll = $("#base").css("position", "absolute");
	$(window).scroll(function () {
	    base_scroll.css("top", document.body.scrollTop);
	});
	$(document).scrollTop(0);
    }
});