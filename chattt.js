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
            console.log('Registration method - chattt.js');
            a.forEach(function (user)
            {
            	console.log('USER EMAIL: ' + user.email + '               registration method - chattt.js')
                if(user.email == encodeURIComponent(data.email))
                {
                    userEmailExists = true;
                    console.log('ima takuw mail = true - chattt.js')
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
            console.log('Are following fields OK? chattt.js requiredFieldsOk: ', requiredFieldsOk);
            if (!requiredFieldsOk) {
                return false;
            } else {
                console.log('METHODS FROM SERVER chattt.js');
                console.log(db);
                console.log('METHODS FROM SERVER chattt.js');
                db.createUser(data);
                return true;
            }
        }, function error (err) {
			console.log(err);
        });
        },
    login: function (data /*username pass*/) {
        console.log('Logvam se ! - chattt.js');
        //get pass hash from db by username
        bcrypt.genSalt(11, function (err, salt) {
            bcrypt.hash(data.password, salt, function (err, hashedPassword) {
                data.password = hashedPassword;
                console.log('HASH' + data.password);

                db.getUsers(data.email).then(function success(u) {

                    
                    console.log('LOGGING FOUND USER: ' + u);
                    //compare data.password to hash

					console.log('USER PASSWORD ARRAY -> OBJECT ->  ' + u[0].password);
                    bcrypt.compare(u[0].password,data.password).then(function(res) {
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
