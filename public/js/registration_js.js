var bcrypt = require('bcrypt');
var db = require('./database.js');
var swal = require('sweetalert');

module.exports = {

    registration: function(data /*username pass email gender*/) {
        return db.getUser(data.email).then(function (user) {
            data.gender = 1;

            var requiredFieldsOk = !!(data.nickname &&
                data.email &&
                data.gender &&
                data.nickname);
console.log(111111111111111)
            if (user.length) {
                return{
                    success: false,
                    message: 'Email already Taken'
                }
            }


               return bcrypt.genSalt(11).then(function (err, salt) {
                   console.log(data.password );
                   console.log(salt );

                   console.log('99999999999999999999999999');


                   return bcrypt.hash(data.password, 11).then(function(hashedPassword) {
                       // return {
                       //     success: false,
                       //     message: 'kuuuuuuuuuuuuuuuuuuur'
                       // };
                       console.log('baba ti ');

                       console.log(hashedPassword);
                       console.log(data.password);
                        console.log(data);
                       data.password = hashedPassword;
                       if(hashedPassword){
                           db.createUser(data);
                           return {
                               success: true,
                               message: 'evala'
                           };
                       }

                       return {
                           success: false,
                           message: 'kur'
                       };

                   }).catch(function (data) {
                       return {
                           success: false,
                           message: 'General errorrppppppppppp'
                       };
                   }); // catch
               })
        }).catch(function (data) {
            return {
                success: false,
                message: 'General error222222222'
            };
    }); /* golqmata skoba*/
    }
};