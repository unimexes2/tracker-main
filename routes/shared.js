const router = require("express").Router();
const bcryptjs = require('bcryptjs');
const User = require("../models/User.model")
const saltRounds = 10;
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');
module.exports = router;

router.get("/", (req, res, next) => {
  res.render("./index");
});

////LOGIN FORM!!!!!

router.post('/signup', (req, res, next) => {
  const { username, password } = req.body;
  let user = username;
  const saltRounds = 10;
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  debugger
   if (!regex.test(password)) {
  
      res
  
        .status(500)
  
        .render('./signup', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
  
      return;
  
    }

  bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {
      return User.create({
        username,
        passwordHash: hashedPassword
      });
    })
    .then((userCreated)=>{debugger
    
    User.findOne({ "username": userCreated.username })
    .then(user => {
      if (!user) {
        res.render('./login.hbs', { errorMessage: 'User is not registered. Try with other one.' });
        return;
      } else if (bcryptjs.compareSync(password, user.passwordHash)) {
        console.log(user)
        req.session.currentUser = user;
        res.render('./index.hbs', { userInSession: req.session.currentUser });
      } else {
        res.render('./login.hbs', { errorMessage: 'Incorrect password.' });
      }
    })})
       
    .catch((error)=>{ 
      res.render('./signup.hbs', {errorMessage : 'Username  need to be unique username is already used.'}
      )
    })
      
     
  })



router.get('/signup', (req, res, next) => {
  res.render("./signup.hbs");
})



router.get('/login', (req, res, next) => {
  res.render("./login.hbs");
})

router.post('/login', (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.render('./login', { errorMessage: 'All fields are mandatory. Please provide your username, email and password.' });
    return;
  }
  User.findOne({ "username": username })
    .then(user => {
      if (!user) {
        res.render('./login.hbs', { errorMessage: 'User is not registered. Try with other one.' });
        return;
      } else if (bcryptjs.compareSync(password, user.passwordHash)) {
        console.log(user)
        req.session.currentUser = user;
        res.render('./index.hbs', { userInSession: req.session.currentUser });
      } else {
        res.render('./login.hbs', { errorMessage: 'Incorrect password.' });
      }
    })
    .catch(error => {
    

    });

})



