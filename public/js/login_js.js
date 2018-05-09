var bcrypt = require('bcrypt');
var db = require('./database.js');

module.exports = {
    login: function (data /*username pass*/) {
        console.log('Logvam se ! - login.js');

        return db.getUser(data.email).then(function success(user) {
            if (!user.length) { 
                return {
                    success: false,
                    message: 'Wrong email'
                };
            }

            return bcrypt.compare(data.password,user[0].password).then(function(res) {
                if(res){
                    return {
                        success: true,
                        token: 'token', /* + user[0].password + user[0].email */
                        username: user[0].email
                    };
                }
                return {
                    success: false,
                    message: 'Wrong password'
                };
            });
        }).catch(data => {
            console.log(1111111111111111111);

            return {
                success: false,
                message: 'General error'
            };
        });
    }
};
    