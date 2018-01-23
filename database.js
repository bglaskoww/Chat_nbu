var User = require('./user.js').User; // izpolzwam metod user ot user.js,kudeto moga da pipam samo po red 18
                                        // (kudeto e konekciqta),bez da moga da pipam dr
var bcrypt = require('bcrypt');

module.exports = (function() {
    return {
        createUser: function (userData) {
            // console.log('testtt');
            // // console.log(userData);
            // console.log(userData.password);
            var password_now = userData.password;
            // console.log('testtt');
            //   userData.password = 'fake_pass';
            // console.log(userData.password);

            if(password_now) {
                console.log('zashto before i die fighting for you');
                bcrypt.genSalt(11, function (err, salt) {
                    console.log('w solta sum ? :D');
                    bcrypt.hash(password_now, salt, function (err, hashedPassword) {
                    console.log('w hasha sum ? :D' + ' ' + hashedPassword);
                        password_now = hashedPassword;
                    });
                });
            }

            var usr = new User(
                {
                    name: encodeURIComponent(userData.name),
                    nickname: encodeURIComponent(userData.nickname),
                    password: encodeURIComponent(userData.password),//hashed pass
                    email: encodeURIComponent(userData.email),
                    gender: parseInt(userData.gender)
                });

           usr.save(function (err, usr) {
                if (err) {  
                    console.error(err);
                }
                console.log(usr.name + ' registered!');
            });
        },
        getUser: function (email) {
            return User.find({email: email});
        },
        getUsers: function () {
            return User.find();
        },

        authorize: function (username, password) {
            
            // var loginAttempt = User.find()....
            //hash(loginAttempt.password) == hasedPassword
        }
    };
})();