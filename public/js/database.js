var User = require('./user.js').User; // izpolzwam metod user ot user.js,kudeto moga da pipam samo po red 18
                                        // (kudeto e konekciqta),bez da moga da pipam dr
// var bcrypt = require('bcrypt');

module.exports = (function() {
    return {
        createUser: function (userData) {

            console.log('aaaaaaaaa password_now twa li nabivam ? database.js ' + userData.password);

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
        getAllUsers: function () {
            console.log('Function getUsers - database.js');
            return User.find();
        },

        authorize: function (username, password) {
            
            // var loginAttempt = User.find()....
            //hash(loginAttempt.password) == hasedPassword
        }
    };
})();