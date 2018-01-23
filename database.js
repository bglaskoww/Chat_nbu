var User = require('./user.js').User; // izpolzwam metod user ot user.js,kudeto moga da pipam samo po red 18
                                        // (kudeto e konekciqta),bez da moga da pipam dr
var bcrypt = require('bcrypt');

module.exports = (function() {
    return {
        createUser: function (userData) {
            
            var password_now = userData.password;

            var usr = new User(
                {
                    name: userData.name,
                    nickname: userData.nickname,
                    password: userData.password,//hashed pass
                    email: userData.email,
                    gender: parseInt(userData.gender)
                });

           usr.save(function (err, usr) {
                if (err) {  
                    console.error(err);
                }
                console.log(usr.name + ' registered! - database.js');
            });
        },
        getUser: function (email) {
            return User.find({email: email});
        },
        getUsers: function () {
            console.log('Function getUsers - database.js');
            return User.find();
            console.log('Function getUsers - database.js');

        },

        authorize: function (username, password) {
            
            // var loginAttempt = User.find()....
            //hash(loginAttempt.password) == hasedPassword
        }
    };
})();