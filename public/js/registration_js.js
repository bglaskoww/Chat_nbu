var bcrypt = require('bcrypt');
var db = require('./database.js');
var swal = require('sweetalert');

module.exports = {

    registration: function(data /*username pass email gender*/) {
        return db.getUser(data.email).then(function success(user) {
            data.gender = 1;

            var requiredFieldsOk = !!(data.nickname &&
                data.email &&
                data.gender &&
                data.nickname);

            if (user.length) {
                return{
                    success: false,
                    message: 'Email already Taken'
                }
            }
               return bcrypt.genSalt(11, function (err, salt) {
                    return bcrypt.hash(data.password, salt).then(function(hashedPassword) {
                        data.password = hashedPassword;
                        if(hashedPassword){
                            db.createUser(data);
                            return {
                                success: true,
                                message: 'evala'
                            };
                        }
                    }).catch(data => {
                        return {
                            success: false,
                            message: 'General error'
                        };
                    });
                })
        }); /* golqmata skoba*/
    }
};