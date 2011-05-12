var router = require('./lib/node-router');
var server = router.getServer();
var io = require('./lib/socket.io');
var socket = io.listen(server.getRaw());

server.get('/', router.staticHandler('./pages/index.html'));

server.get(/\/static/, router.staticDirHandler('./static/', '/static'));
server.get(/\/pages/, router.staticDirHandler('./pages/', '/pages'));

server.listen(8080);