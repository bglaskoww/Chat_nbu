var bcrypt = require('bcrypt');
var db = require('./database.js');

module.exports = {

    registration: function(data /*username pass email gender*/) {
        return db.getUser(data.email).then(function (user) {
            data.gender = 1;

            // var requiredFieldsOk =
            //     !!(
            //     data.nickname &&
            //     data.email &&
            //     data.gender &&
            //     data.nickname
            //     );
            if (user.length) {
                return {
                    success: false,
                    message: 'Email already Taken'
                }
            }

               return bcrypt.genSalt(11).then(function (err, salt) {
                   // console.log(data.password );
                   // console.log(salt );

                   return bcrypt.hash(data.password, 11).then(function(hashedPassword) {
                       data.password = hashedPassword;
                       if(hashedPassword){
                           db.createUser(data);
                           return {
                               success: true,
                               message: 'Successfully created new registration!',
                               message2:'Transferring to Login section!'

                           };
                       }

                       return {
                           success: false,
                           message: 'Problem while making registration!'
                       };

                   }).catch(function (data) {
                       return {
                           success: false,
                           message: 'General in bcrypt.hash method'
                       };
                   }); // catch
               })
        }).catch(function (data) {
            return {
                success: false,
                message: 'General in global getUser method'
            };
    }); /* golqmata skoba*/
    }
};