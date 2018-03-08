var UserHandler = require('../../server.js');
var bcrypt = require('bcrypt');
var db = require('./database.js');


module.exports = {

login: function (data /*username pass*/) {
    

        console.log('Logvam se ! - front.js');
        //get pass hash from db by username
        // bcrypt.genSalt(11, function (err, salt) {
        //     bcrypt.hash(data.password, salt, function (err, hashedPassword) {
                // console.log('HASH       ' + data.password);
               return db.getUser(data.email).then(function success(user) {
                    // console.log('LOGGING FOUND USER: ' + user + ': USER ');
                    // console.log(user[0].password + '  ?? = ??' + data.password);
                    //compare data.password to hash
					// console.log('USER PASSWORD ARRAY -> OBJECT ->  ' + user[0].password);
                    return bcrypt.compare(data.password,user[0].password).then(function(res) {
                        if(res){
                            console.log('MINAVAAAAAAAAAAAAAAAAAAAAa ---------- ', res);
                            return {
                                token: 'token' + user[0].password + user[0].email,
                                username: user[0].email
                            };
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
    }
};
    