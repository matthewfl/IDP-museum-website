var router = require('./lib/node-router');
var server = router.getServer();
var io = require('./lib/socket.io');
var socket = io.listen(server.getRaw());


server.get('/', function () {
    return "hello world";
});


server.listen();