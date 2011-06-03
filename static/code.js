var tablet = true;
var socket =  new io.Socket(document.domain, {
    connectTimeout: 6000,
    transports: ['xhr-multipart', 'xhr-polling', 'jsonp-polling'],
    reconnectionDelay: 25,
    maxReconnectionAttempts: 100
});



function link (href) {
    //var href = $(this).attr("href");
    if(/question/.exec(href)) return false;
    if(/http/.exec(href)) { alert("This opens external web page: "+href); return false; }
    $("#contentParent").load(href + " #content");
    var background = /pages\/.*\.html/.exec(href) ? href.replace(/\/pages\/(.*)\.html/, "/static/backgrounds/$1.jpg") : "/static/backgrounds/default.jpg";
    if(tablet) $("#background").css("background", 'url("'+background+'") fixed -240px 32px');
    $(document).scrollTop(0);
    return false;
}

$(function () {
    $("a").live('click', function () {
	alive = true;
	return link($(this).attr("href"));
    });

    if($(window).height()*$(window).width() > 400000) tablet = false;
    
    if(tablet) {
	//	alert("tablet");
	var base_scroll = $("#base").css("position", "absolute");
	$(window).scroll(function () {
	    base_scroll.css("top", document.body.scrollTop);
	    alive = true;
	});
	$(document).scrollTop(0);
    }else{
	$("#background").css("background", 'url("/static/backgrounds/default.jpg") 0px -32px');
	$("#nav").css("top", "0px");
	//$("#nav").css("background", '#404040');
    }
});


for(var i=0;i<20;i++)
    location.hash=i;
location.hash="";


var alive = false;
$(window).mousemove(function () {
    alive = true;
});

setInterval(function () {
    if(alive) socket.send("alive");
}, 3000);

setInterval(function () {
    alive = false;
}, 20000);


socket.on('disconnect', function () {
    setTimeout(function () {
	socket.connect();
    }, 2500);
});
socket.on('message', function (data) {
    if(data == "reload") location.reload(true);
    if(data == "quiz") $.facebox({ajax: "/question"});
    if(data == "showA") {
	$("a.answer").parent().css("background", "#FF0000");
	$("a.answer.correct").parent().css("background", "#00FF00");
	$("#qthanks").html("<h3>Thank you for participating in the Terradise quiz<br>We hope that you enjoyed the Museum</h3>");
	setTimeout(function () {
	    $(document).trigger('close.facebox');
	}, 5000);
    }
});

$(function () {
    socket.connect();
});

$("a.answer").live('click', function () {
    $("a.answer").parent().css("font-weight", "normal");
    $(this).parent().css("font-weight", "bold");
    return false;
});

/*
setInterval(function () {
    $.ajax('/ping'+Math.random(), function () {});
}, 5000);

*/