var router = require('./lib/node-router');
var server = router.getServer();
var io = require('./lib/socket.io');
var socket = io.listen(server.getRaw());
var fs = require('fs');

var aliveCount = 0;

server.get('/', router.staticHandler('./pages/index.html'));

server.get('/reload', function (req, res) {
    socket.broadcast("reload");
    return "sent";
});

server.get('/qtest', function () {
    runQuestion();
    return "sent";
});

server.get(/\/random(.*)/, function (req, res, match) {
    return "page "+match;
});

server.get(/\/static/, router.staticDirHandler('./static/', '/static'));
server.get(/\/pages/, router.staticDirHandler('./pages/', '/pages'));

server.get(/\/ping/, function (req, res) {
    res.writeHead(200);
    setTimeout(function () {
	res.write("document.write('<script src=\"/ping"+Math.random()+"\"></script>');");
	res.end()
    }, 5000);
});

var questions = eval('(' + fs.readFileSync('./questions.dat').toString() + ')');

var current_question = [];
var question_queue = [];
var question_html = false;

function formatQuestion (question) {
    var str='<div id="question"><center><h1>Terradise</h1></center>';
    str += 
    str += '<p>'+question[0]+'</p>';
    str += '<br><ol>'
    for(var i=2; i<question.length;i++) {
	str += "<li><a href=\"#question"+Math.random()+"\" class=\"answer"+(i==question[1]+2?" correct":"")+"\">"+question[i]+"</a></li>";
    }
    str += "</ol><div id='qthanks'></div>"
    return str;
}

server.get('/question', function (req, res) {
    if(question_html) return question_html;
    question_queue.push(res);
});

var question_running = false;
function  runQuestion () {
    return;
    if(question_running) return;
    question_html = false;
    socket.broadcast("quiz");
    setTimeout(function () {
	var q = questions[Math.floor(Math.random()*questions.length)];
	question_html = formatQuestion(q);
	for(var i=0; i < question_queue.length; i++) {
	    try {
		question_queue[i].write(question_html);
		question_queue[i].end();

	    } catch(e) {}
	}
	setTimeout(function () {
	    socket.broadcast("showA");
	    setTimeout(function () {
		question_running = false;
	    }, 50000); // 50 sec
	}, 15000);
    }, 2500);
    question_running = true;
}

server.listen(8080);

socket.on('connection', function (client) {
    client.on('message', function (data) {
	if(data == "alive") {
	    aliveCount++;
	    console.log("alive count", aliveCount, "of", socket.server.connections);
	    setTimeout(function() {
		aliveCount--;
	    }, 2970);
	}

	if(aliveCount >= 3) {
	    if(Math.random() > .2) // fix to higher number
		runQuestion();
	}
    });
    client.on('disconnect', function () {

    });
});

console.log(socket)