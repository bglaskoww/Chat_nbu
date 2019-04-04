var User = require('./user.js').User;

module.exports = (function() {
    return {
        createUser: function (userData) {

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