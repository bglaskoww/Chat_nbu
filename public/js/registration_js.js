var bcrypt = require('bcrypt');
var db = require('./database.js');
var swal = require('sweetalert');

module.exports = {

registration: function(data /*username pass email gender*/) {
			//get users from db
    // db.getAllUsers().then(function success(BaseUser) {
    return db.getUser(data.email).then(function success(user) {
console.log(user);
        data.gender = 1;

        var requiredFieldsOk = !!(data.nickname &&
            data.email &&
            data.gender &&
            data.nickname);

        if(!requiredFieldsOk){
            return false;
        }
        if (user.length) {
            console.log('ima takuw mail = true - front.js');
            return false;
        }
            /*HASHING PASS*/
        // console.log(data);

           return bcrypt.genSalt(11, function (err, salt) {
                return bcrypt.hash(data.password, salt).then(function(hashedPassword) {
                    console.log('istinksata praloa       ' + data.password);
                    data.password = hashedPassword;
                    console.log('parolata na toq w chattt.js predi da q nabiq w DB       ' + data.password);
                    if(hashedPassword){
                        console.log('PASH HASHA MINAVA');


                            db.createUser(data);
                            return true;
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