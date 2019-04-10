var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var server      = require('http').Server(app);
var io          = require('socket.io')(server);

var registration_js     = require('./public/js/registration_js.js');
var login_js            = require('./public/js/login_js.js');
var socketHandlers_js   = require('./public/js/socketHandlers_js.js');

server.listen(8080);
console.log('SOCKET CONNECTED');

var options = {
    dotfiles:   'ignore',
    etag:       false,
    extensions: ['htm', 'html'],
    index:      'html/landing.html',
    maxAge:     '1d',
    redirect:   false
};

app.use(bodyParser.urlencoded({extended: false}));
app.use('/login', express.static('./public/html',           {index: 'login.html'}));
app.use('/registration', express.static('./public/html',    {index: 'registration.html'}));
app.use('/index', express.static('./public/html',           {index: 'index.html'}));
app.use('/chat', express.static('./public/html',            {index: 'chat.html'}));
app.use('/', express.static('./public/', options));

app.post('/index', (req, res) => {
    let loginPromise = login_js.login(req.body);
    loginPromise.then((data) => {
        res.end(JSON.stringify(data));
        res.redirect('/chat.html');
    })
});

app.post('/login', (req, res) => {
    let loginPromise = login_js.login(req.body);
    loginPromise.then(data => {
        if (data.success === false) {
            return res.status(422).jsonp({error: data.message});
        }
        console.log('resolve ', data, ' server.js');
        res.end(JSON.stringify(data));
    })
});
app.post('/register', (req, res) => {
    console.log(req.body);
    let successPromise = registration_js.registration(req.body);
    successPromise.then(function (data) {
        if (data.success === false) {
            return res.status(422).jsonp({error: data.message});
        }
        res.end(JSON.stringify(data));
    })
});

io.on('connection', (socket) => {
    for (let k in socketHandlers_js.socketHandlers) {
        socket.on(k, (data) => {
            socketHandlers_js.socketHandlers[k](socket, data);
        });
    }
    socket.on('disconnect', () => {
        socketHandlers_js.socketHandlers.logout(socket, {});
    });

    socket.emit('hello', {app: 'Swift Chat app here!'});
});
