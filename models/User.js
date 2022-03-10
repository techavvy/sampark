const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique : true
    },
    firstName : {
        type : String,
        required : true,
        unique : false
    },
    lastName : {
        type : String,
        required : true,
        unique : false
    },
    email : {
        type : String,
        // required : true,
    },
    age : {
        type : Number,
        required : false,
        unique : false
    },
    phnumber : {
        type : Number,
        required : false,
    },
    country : {
        type : String,
        required : false,
        unique : false
    },
    address : {
        type : String,
        required : false,
        unique : false
    },
    profileImg:{
        data : Buffer,
        contentType : String
    },
    password:{
        type : String,
        required : true,

    }
});

const User = mongoose.model('users', UserSchema);

module.exports = User;