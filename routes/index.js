const router = require('express').Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const Article = require('../models/Article');
const User = require('../models/User');
//INDEX ROUTE
router.get('/', (req, res) => {
    res.render('index')
})

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => {
  Article.find({}, function(err, data) {
    if(err){
      console.log(err);
    }else{
     res.render('dashboard', {
       user: req.user,
       posts : data
     })
    }
    });
});

router.get('/profile', ensureAuthenticated, (req, res) => {
  res.render('profile', {
    user : req.user
  });
});

router.get('/updateprofile', ensureAuthenticated, (req, res) => {
  res.render('updateprofile', {
    user : req.user
  });
});

router.get('/chat', ensureAuthenticated, (req, res) => {
  res.render('chat', {
    user : req.user
  });
});

// router.get('*',ensureAuthenticated ,(req, res) => {
//   res.render('404');
// })

// router.get('*',(req, res) => {
//   res.render('404');
// })

// DELETE ACCOUNT
router.post('/deleteaccount/:userid', (req, res) => {
  const userid = req.params.userid;
  User.deleteOne({id : userid}, (err, obj)=>{
    if(err) console.log(err)
    else res.redirect('/');
  })
})


module.exports = router;