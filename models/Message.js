const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    name : {
        type: String
    },
    message : {
        type : String
    }
});

const Message = mongoose.model('Messages', MessageSchema);

module.exports = Message;