const router = require("express").Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const path = require('path');
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const fs = require('fs');
const User = require("../models/User");
const { forwardAuthenticated, ensureAuthenticated } = require("../config/auth");


// LOGIN ROUTE
router.get("/login", forwardAuthenticated, (req, res) => {
  res.render("login");
});

// REGISTER ROUTE
router.get("/register", forwardAuthenticated, (req, res) => {
  res.render("register");
});

// STORING PROFILE PICTURE OF USER
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});
const upload = multer({ storage: storage });
// REGISTERING A USER
router.post("/register", upload.single("image"), (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    username,
    phnumber,
    country,
    password,
    confirmPassword,
    address,
    image,
    age,
  } = req.body;
  // console.log(firstName, username);
  let errors = [];

  
  

  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !confirmPassword ||
    !phnumber ||
    !country ||
    !address 
    
  ) {
    errors.push({ msg: "Please enter all fields" });
  }

  if (password != confirmPassword) {
    errors.push({ msg: "Passwords do not match" });
  }

  if (phnumber.length !== 10) {
    errors.push({ msg: "Please Enter a Valid Phone Number !" });
  }

  if (password.length <= 8) {
    errors.push({ msg: "Password must be at least 8 characters" });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      firstName,
      username,
      lastName,
      email,
      age,
      address,
      phnumber,
      country,
      password,
      confirmPassword,
      image
    });
  } else {
    User.findOne({ username: username }).then((user) => {
      if (user) {
        errors.push({ msg: "Username already in use" });
        res.render("register", {
          errors,
          firstName,
          lastName,
          username,
          email,
          country,
          age,
          address,
          phnumber,
          password,
          confirmPassword,
          image,
        });
      } else {
        const newUser = new User({
          firstName,
          lastName,
          email,
          age,
          username,
          phnumber,
          country,
          address,
          password,
          profileImg: {
            data: fs.readFileSync(
              // path.join(__dirname + "/uploads/" + req.file.filename)
            ),
            contentType: "image/png",
          },
        });
        async function hashing() {
          const salt = await bcrypt.genSalt(10);
          newUser.password = await bcrypt.hash(password, salt);
          newUser
            .save()
            .then((user) => {
              req.flash("success_msg", "You are now registered and can log in");
              res.redirect("/users/login");
            })
            .catch((err) => console.log(err));
        }

        hashing();
      }
    });
  }
});

// LOGIN ROUTE
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});

// LOGOUT ROUTE
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/users/login");
});

// UPDATE USER PROFILE REQUEST
router.post("/updateprofile", (req, res) => {
  const { firstName, lastName, email, age, phnumber, country, address } =
    req.body;
  User.updateMany({
    firstName: firstName,
    lastName: lastName,
    email: email,
    age: age,
    phnumber: phnumber,
    country: country,
    address: address,
  })
    .then((user) => {
      req.flash("success_msg", "User updated succesfully");
      res.redirect("/profile");
    })
    .catch((err) => console.log(err));
});

// ERROR 404 ROUTE
// router.get('*', (req, res) => {
//     res.render('404');
// })

// router.get('*',ensureAuthenticated ,(req, res) => {
//   res.render('404');
// })

router.get("/:username", ensureAuthenticated, (req, res) => {
  const userID = req.params.username;
  User.findOne({ username: userID }).then((user) => {
    if (user) {
      res.render("user", { user });
    } else {
      res.render("usernotfound");
    }
  });
});

router.get('/chat/:userid', ensureAuthenticated, (req, res) => {
  const userID = req.params.userid;
  User.findOne({ username: userID }).then((user) => {
    if (user) {
      res.render('dm', {userID, user})
    } else {
      res.render("usernotfound");
    }
  });
})

module.exports = router;
