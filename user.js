var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/chatjsdb');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
    console.log('DB CONNECTED');
});
//Create table descriptions
var userSchema = mongoose.Schema({
    name: String,
    nickname: String,
    password: String,
    email: String,
    gender: Number
});
//Create table reference  -> (NAME, SCHEMA)
var User = mongoose.model('User', userSchema);

module.exports = {
    User: User
};