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

        if(!requiredFieldsOk){
            return{
                success: false,
                message: 'Problem with fields'
            }
        }
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
                        return{
                            success: true,
                            message: 'successfully registered'
                        }

                    }
                    else{
                        return{
                            success: false,
                            message: 'Wrong password'
                        }       
                    }
                });
            }, function error (err) {
                    console.log(err);
                });
            }); /* golqmata skoba*/
        }
};