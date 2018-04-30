var bcrypt = require('bcrypt');
var db = require('./database.js');
var swal = require('sweetalert');

module.exports = {

registration: function(data /*username pass email gender*/) {
			console.log('Pravq registraciq !');
			//get users from db
    db.getAllUsers().then(function success(BaseUser) {

            var userEmailExists = false;

            BaseUser.forEach(function (user) // w user obhojdam wsichki useri
            {
                if(user.email == data.email)
                {
                    userEmailExists = true;
                    console.log('ima takuw mail = true - front.js');
                    window.alert('ima takuw mail = true ');
                    return false;
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
                            data.email &&
                            data.gender &&
                            data.nickname);
                        if (userEmailExists){
                            requiredFieldsOk = false;
                        }

                        if (!requiredFieldsOk) {
                            return false;
                        } else {
                            db.createUser(data);
                            return true;
                        }
                    }
                    else{
                        console.log('PASH HASHA MINAVA NE MINAVAAAAAAAAAAa');
                        return false;
                    }
                });
            }, function error (err) {
                    console.log(err);
                });
            }); /* golqmata skoba*/
        }
};