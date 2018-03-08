var UserHandler = require('../../server.js');
var bcrypt = require('bcrypt');
var db = require('./database.js');

module.exports = {

registration: function(data /*username pass email gender*/) {
			console.log('Pravq registraciq !');
			//get users from db
		var users = db.getAllUsers().then(function success(BaseUser) {

            var userEmailExists = false;

            console.log('Registration method - front.js');
            BaseUser.forEach(function (user) //
            {
            	console.log('USER EMAIL: ' + user.email + '               registration method - front.js');
                if(user.email == data.email)
                {
                    userEmailExists = true;
                    console.log('ima takuw mail = true - front.js')
                }
            });

            /*HASHING PASS*/

            bcrypt.genSalt(11, function (err, salt) {
                bcrypt.hash(data.password, salt).then(function(hashedPassword) {
                    console.log('istinksata praloa       ' + data.password);
                    data.password = hashedPassword;
                    console.log('parolata na toq w chattt.js predi da q nabiq w DB       ' + data.password);
                    if(hashedPassword){
                        console.log('PASH HASHA MINAVA');

                        var requiredFieldsOk = !!(data.nickname &&
                            // data.password &&
                            data.email &&
                            data.gender &&
                            data.nickname);
                        if (userEmailExists){
                            requiredFieldsOk = false;
                        }
                        console.log('Are following fields OK? front.js requiredFieldsOk: ', requiredFieldsOk);
                        if (!requiredFieldsOk) {
                            return false;
                        } else {
                            console.log('METHODS FROM SERVER front.js');
                            console.log(db);
                            console.log('METHODS FROM SERVER front.js');
                            console.log(data);
                            db.createUser(data);
                            return true;
                        }
                    }
                    else{
                        console.log('PASH HASHA MINAVA NE MINAVAAAAAAAAAAa');
                    }
                    console.log('tuka pasa e ' + data.password);
                });
            }, function error (err) {
                    console.log(err);
                });
            }); /* golqmata skoba*/
        },
};