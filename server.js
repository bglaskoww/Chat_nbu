var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var server = require('http').Server(app);
var io = require('socket.io')(server);

var chat = require('./chattt.js');
server.listen(8080);
console.log('SOCKET CONNECTED');

var options = {
	dotfiles: 'ignore',
	etag: false,
	extensions: ['htm', 'html'],
	index: 'registration.html',
	maxAge: '1d',
	redirect: false/*,
	setHeaders: function (res, path, stat) {
		res.set('x-timestamp', Date.now())
	}*/
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use('/login', express.static('./public', {index: 'login.html'}));
app.use('/registration', express.static('./public', {index: 'registration.html'}));
app.use('/', express.static('./public', options));

app.post('/login', function(req, res){
    console.log(req.body);
    var success = chat.login(req.body);
    console.log('app post login successfull', success);
    if(!success){
        // redirect to registration.html
        res.redirect('/login.html');
    } else {
        // redirect to /
        res.redirect('/');
    }

});
app.post('/register', function(req, res){
    console.log(req.body);
    var success = chat.registration(req.body);
    console.log('app post reggister successfull', success);
    if(!success){
        // redirect to registration.html
        res.redirect('/registration.html');
    } else {
        // redirect to /
        res.redirect('/');
    }

});
io.on('connection', function (socket) {
	for (let k in chat.socketHandlers) {
		socket.on(k, function(data) {
			chat.socketHandlers[k](socket, data);
		});
	}
	socket.on('disconnect', function() {
		chat.socketHandlers.logout(socket, {});
	});

	socket.emit('hello', { app: 'ChatTT app here!' });
});
