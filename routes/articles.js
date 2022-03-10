const router = require('express').Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const Article = require('../models/Article');


router.get('/new', ensureAuthenticated, (req, res) => {
    res.render('createArticle', {
        user : req.user
    });
})
router.post('/create',ensureAuthenticated, async (req, res) => {
    let article = new Article({
        title : req.body.title,
        post : req.body.post,
        createdAt : new Date,
        postedBy : req.user.username
    })
    try{
        article = await article.save();
        res.redirect('/dashboard')
    }
    catch (e){
        console.log(e);
    }
})

router.post('/delete/:id',  (req, res)=> {
    Article.findByIdAndDelete(req.params.id, function (err, done) {
        if (err){
            console.log(err)
        }
        else{
            res.redirect('/dashboard')
        }
    })
})

module.exports = router;