const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
    title: {
        type : String
    },
    post : {
        type : String
    },
    createdAt:{
        type: Date,
        default: Date.now() 
    },
    postedBy:{
        type: String
    }
});

const Article = mongoose.model('Articles', ArticleSchema);

module.exports = Article;