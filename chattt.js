var UserHandler = require('./server.js');
var bcrypt = require('bcrypt');
var db = require('./database.js');
var USERS = {
	/* "Krum": 'Krum',
	 * "Bobby": 'Bobby'*/
};

function usersList(socket) {
	console.log('Broadcasting users list', Object.keys(USERS));
	socket.broadcast.emit('usersList', {users: Object.keys(USERS)});

	// NOTE explicitly send the users list to myself
	socket.emit('usersList', {users: Object.keys(USERS)});
}

module.exports = {
	registration: function(data /*username pass email gender*/) {
			console.log('Pravq registraciq !');
			//get users from db
		var users = db.getUsers().then(function success(a) {
            var userEmailExists = false;
            console.log('LOGVAM AAAAAAAAAAAAAAAAAAAAAAA');
            console.log(a);
            a.forEach(function (user)
            {
            	console.log('USER EMAIL: ' + user.email)
                if(user.email == encodeURIComponent(data.email))
                {
                    userEmailExists = true;
                }
            });

            var requiredFieldsOk = !!(data.nickname &&
                data.password &&
                data.email &&
                data.gender &&
                data.nickname);
            if (userEmailExists){
                requiredFieldsOk = false;
            }
            console.log('requiredFieldsOk: ', requiredFieldsOk);
            if (!requiredFieldsOk) {
                return false;
            } else {
                console.log('console logvam da widq metodite');
                console.log(db);
                console.log('console logvam da widq metodite');
                db.createUser(data);
                return true;
            }
        }, function error (err) {
			console.log(err);
        });
        },
    login: function (data /*username pass*/) {
        console.log('Logvam se !');
        //get pass hash from db by username
        bcrypt.genSalt(11, function (err, salt) {
            bcrypt.hash(data.password, salt, function (err, hashedPassword) {
                data.password = hashedPassword;
                console.log('are be sled hasha' + data.password);

                // bcrypt.compare(myPlaintextPassword, hash, function(err, res) {
                // res == true });

                //if ok else
                db.getUsers(data.email).then(function success(u) {
                    console.log('LOGGING FOUND USER: ' + u);
                    //compare data.password to hash
					console.log('guz 2 ' + u.password);
                    bcrypt.compare(data.password, u.password).then(function(res) {
                        // res == true
                        if(res){
                            console.log('MINAVAAAAAAAAAAAAAAAAAAAAa');
                        }
                        else{
                            console.log('NE MINAVAAAAAAAAAAa');
                        }
                    });

                }, function error (err) {
                    console.log(err);
                });
            });
        });
    },
	socketHandlers: {
		login: function(socket, data /*{nick: 'Nickname'}*/) {
			if (data.nick && !USERS[data.nick]) {
				USERS[data.nick] = socket;
				socket.nickname = data.nick;
				socket.emit('loginSuccess', { nick: data.nick });

				console.log('Hello, ', data.nick);
				usersList(socket);
			}
		},
		logout: function(socket, data /*{}*/) {
			if (socket.nickname && USERS[socket.nickname]) {
				delete USERS[socket.nickname];
				delete socket.nickname;

				console.log('Goodbye', socket.nickname);
				usersList(socket);
			}
		},
		sendMessage: function(socket, data /*{to:"user", msg:"What's up"}*/) {
			if (data.to && USERS[data.to]) {
				USERS[data.to].emit('receiveMessage', { from: socket.nickname, msg: data.msg });
				console.log(socket.nickname, ' to ', data.to, ': ', data.msg);
			}
		},
		

		
	}
};
