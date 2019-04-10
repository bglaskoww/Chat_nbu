var bcrypt  = require('bcrypt');
var db      = require('./database.js');

module.exports = {
    login: (data /*username pass*/) => {
        console.log('Logging! - login.js');

        return db.getUser(data.email).then(function success(user) {
            if (!user.length) {
                return {
                    success: false,
                    message: 'Wrong email!'
                };
            }

            return bcrypt.compare(data.password, user[0].password).then((res) =>{
                if (res) {
                    return {
                        success: true,
                        token: 'token' + user[0].email,
                        username: user[0].email
                    };
                }
                return {
                    success: false,
                    message: 'Wrong password!'
                };
            });
        }).catch((data) => {
            return {
                success: false,
                message: 'General error in getUser method!'
            };
        });
    }
};
    