var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var server = require('http').Server(app);
var io = require('socket.io')(server);
var swal = require('sweetalert');

// var chat = require('./chattt.js');
var registration_js = require('./public/js/registration_js.js');
var login_js = require('./public/js/login_js.js');

var socketHandlers_js = require('./public/js/socketHandlers_js.js');

server.listen(8080);
console.log('SOCKET CONNECTED');

var options = {
	dotfiles: 'ignore',
	etag: false,
	extensions: ['htm', 'html'],
	index: 'html/copypaste.html',
	maxAge: '1d',
	redirect: false/*,
	setHeaders: function (res, path, stat) {
		res.set('x-timestamp', Date.now())
	}*/
};

app.use(bodyParser.urlencoded({ extended: false }));
app.use('/login', express.static('./public/html', {index: 'login.html'}));
app.use('/registration', express.static('./public/html', {index: 'registration.html'}));
app.use('/index', express.static('./public/html', {index: 'index.html'}));
app.use('/chat', express.static('./public/html', {index: 'chat.html'}));
app.use('/', express.static('./public/', options)); //html ?



app.post('/index', function(req, res){
    var loginPromise = login_js.login(req.body);
    loginPromise.then((data) => {
        res.end(JSON.stringify(data));
        res.redirect('/chat.html');
    })
});

app.post('/login', function(req, res){
    var loginPromise = login_js.login(req.body);
    loginPromise.then(data => {
         console.log(typeof(data));
        if (data.success === false) {
            return res.status(422).jsonp({ error: data.message });
        }
        console.log('resolve ', data);
        res.end(JSON.stringify(data));
    })
});
    app.post('/register', function(req, res){
        console.log(req.body);
        var successPromise = registration_js.registration(req.body);
        console.log(typeof successPromise);
        console.log(successPromise + 'aaaaaaaaaaaaaaa');
        successPromise.then(function (data)  {
            console.log(data);
            console.log(typeof data);
                if (data.success === false) {
                    return res.status(422).jsonp({ error: data.message });
                }
                    console.log('resolve ', data);
                    res.end(JSON.stringify(data));
        })
    });

io.on('connection', function (socket) {
	for (let k in socketHandlers_js.socketHandlers) {
		socket.on(k, function(data) {
			socketHandlers_js.socketHandlers[k](socket, data);
		});
	}
	socket.on('disconnect', function() {
		socketHandlers_js.socketHandlers.logout(socket, {});
	});

	socket.emit('hello', { app: 'ChatTT app here!' });
});

