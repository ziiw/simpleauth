const express = require('express');
const User = require('./../models/user');

const userRouter = express.Router();

// route to return all users (GET http://localhost:8080/api/users)
userRouter.get('/users', function(req, res) {
  User.find({}, function(err, users) {
    res.json(users);
  });
});

module.exports = userRouter;
