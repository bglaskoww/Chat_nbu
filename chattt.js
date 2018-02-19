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
		var users = db.getAllUsers().then(function success(BaseUser) {

            var userEmailExists = false;

            console.log('Registration method - front.js');
            BaseUser.forEach(function (user) //
            {
                console.log('wlizam da wurtq dali ima takuw email ?');
            	console.log('USER EMAIL: ' + user.email + '               registration method - front.js');
            	console.log('data.email ' + data.email + ' proverka - ?');
                if(user.email == data.email)
                {
                    userEmailExists = true;
                    console.log('ima takuw mail = true - front.js')
                }
            });

            /*HASHING PASS*/

            bcrypt.genSalt(11, function (err, salt) {
                bcrypt.hash(data.password, salt).then(function(hashedPassword) {
                    console.log('istinksata praloa       ' + data.password);
                    data.password = hashedPassword;
                    console.log('parolata na toq w chattt.js predi da q nabiq w DB       ' + data.password);
                    if(hashedPassword){
                        console.log('PASH HASHA MINAVA');

                        var requiredFieldsOk = !!(data.nickname &&
                            // data.password &&
                            data.email &&
                            data.gender &&
                            data.nickname);
                        if (userEmailExists){
                            requiredFieldsOk = false;
                        }
                        console.log('Are following fields OK? front.js requiredFieldsOk: ', requiredFieldsOk);
                        if (!requiredFieldsOk) {
                            return false;
                        } else {
                            console.log('METHODS FROM SERVER front.js');
                            console.log(db);
                            console.log('METHODS FROM SERVER front.js');
                            console.log(data);
                            db.createUser(data);
                            return true;
                        }
                    }
                    else{
                        console.log('PASH HASHA MINAVA NE MINAVAAAAAAAAAAa');
                    }
                    console.log('tuka pasa e ' + data.password);
                });
            }, function error (err) {
                    console.log(err);
                });
            }); /* golqmata skoba*/
        },
    login: function (data /*username pass*/) {
        console.log('Logvam se ! - front.js');
        //get pass hash from db by username


        // bcrypt.genSalt(11, function (err, salt) {
        //     bcrypt.hash(data.password, salt, function (err, hashedPassword) {

                console.log('HASH       ' + data.password);

                db.getUser(data.email).then(function success(user) {
                    console.log('LOGGING FOUND USER: ' + user + ': USER ');
                    console.log(user[0].password + '  ?? = ??' + data.password);
                    //compare data.password to hash

					console.log('USER PASSWORD ARRAY -> OBJECT ->  ' + user[0].password);
                    bcrypt.compare(data.password,user[0].password).then(function(res) {
                        console.log(res + ' ti pa na kwo si be ? :D ');
                        // res == true
                        if(res){
                            console.log('MINAVAAAAAAAAAAAAAAAAAAAAa');
                            // return token trqbwa da naprawq ^^
                        }
                        else{
                            console.log('NE MINAVAAAAAAAAAAa');
                        }
                    });

                }, function error (err) {
                    console.log(err);
                });
            // });
        // });
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
		}

	}
};
