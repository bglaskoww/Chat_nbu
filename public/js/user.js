var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/chatjsdb', { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('DB CONNECTED');
});
//Create table descriptions
var userSchema = mongoose.Schema({
    name:               String,
    nickname:           String,
    password:           String,
    confirmPassword:    String,
    email:              String,
    gender:             Number,
    token:              String
});
//Create table reference  -> (NAME, SCHEMA)
var User = mongoose.model('User', userSchema);

module.exports = {
    User: User
};