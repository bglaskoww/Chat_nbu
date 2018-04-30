var UserHandler = require('../../server.js');
var bcrypt = require('bcrypt');
var db = require('./database.js');
var swal = require('sweetalert');

module.exports = {

login: function (data /*username pass*/) {
    

        console.log('Logvam se ! - login.js');

        return db.getUser(data.email).then(function success(user) {
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
    }
};
    