var bcrypt  = require('bcrypt');
var db      = require('./database.js');

module.exports = {
    registration: (data /*username pass email gender*/) => {
        return db.getUser(data.email).then((user) => {
            data.gender = 1;

            if (user.length) {
                return {
                    success: false,
                    message: 'Email already Taken'
                }
            }

            if (data.password !== data.confirmPassword) {
                return {
                    success: false,
                    message: 'Passwords are different, please match the passwords'
                }
            }

            return bcrypt.genSalt(11).then(() => {

                return bcrypt.hash(data.password, 11).then(function (hashedPassword) {
                    data.password = hashedPassword;
                    if (hashedPassword) {
                        db.createUser(data);
                        return {
                            success: true,
                            message2: 'Click OK to be transferred to the Login section!'
                        };
                    }

                    return {
                        success: false,
                        message: 'Problem while making registration!'
                    };

                }).catch((data) => {
                    return {
                        success: false,
                        message: 'General error in bcrypt.hash method'
                    };
                }); // catch
            })
        }).catch((data) => {
            return {
                success: false,
                message: 'General in global getUser method'
            };
        });
    }
};