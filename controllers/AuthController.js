const express = require('express');
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const jwt    = require('jsonwebtoken'); 

const User = require('./../models/user');

const authRouter = express.Router();

authRouter.post('/signup', function(req, res) {
  const username = req.body.username;
  const password = req.body.password;
  
  bcrypt.hash(password, saltRounds, function(err, hash) {
    // Store hash in your password DB.
    const user = new User({
      username: username,
      password: hash
    });

    // save the sample user
    user.save(function(error) {
      if (error) throw error;

      console.log('[AuthC] - User signed up!');
      res.json({success: true});
    });
  });
});

// route to return all users (GET http://localhost:8080/api/login)
authRouter.post('/login', function(req, res) {
  // find the user
  User.findOne({
    username: req.body.username
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

      bcrypt.compare(req.body.password, user.password, function(err, isValid) {

        if (isValid) {
          // if user is found and password is right
          // create a token with only our given payload
          // we don't want to pass in the entire user since that has the password
          const payload = {
            admin: user.admin
          };
          
          const token = jwt.sign(payload, req.app.get('superSecret'), {
            expiresIn: '24h' // expires in 24 hours
          });

          // return the information including token as JSON
          res.json({
            success: true,
            message: 'Enjoy your token!',
            token: token
          });
        } else {
          res.json({ success: false, message: 'Authentication failed. Wrong password.' });
        }
      });
    }
  });
}); 

module.exports = authRouter;
