const express = require('express')
const router = express.Router()
const User = require('../models/User')

const passport = require('../config/passport');
const createError = require('create-error');
const middlewares = require("../middlewears/secure.mid");


//Is Athenticated Middleware
// function isAuth(req, res, next) {
//     console.log(req.session);
//     if (req.isAuthenticated()) {
  
//       next();
//     } else {
//       res.status(401).json({ message: "No te has logueado" });
//     }
//   }

  
// module.exports.isAuthenticated = (req, res, next) => {
//   if (req.isAuthenticated()) {
//     next();
//   } else {
//     next(createError(403));
//   }
// }

  
router.post('/', (req, res) => {
    console.log('user signup');
    // console.log('req.session', req.session);
    const { username, password } = req.body
    // ADD VALIDATION
        User.findOne({ username: username }, (err, user) => {
            if (err) {
                console.log('User.js post error: ', err)
            } else if (user) {
                res.json({
                    error: `Sorry, already a user with the username: ${username}`
                })
            }
            else {
                const newUser = new User({
                    username: username,
                    password: password
                })
                newUser.save((err, savedUser) => {
                    if (err) return res.json(err)
                    res.json(savedUser)
                    req.session.username = req.body.username;
                    console.log('req.session', req.session);
                })
            }
        })
})

router.post(
  '/login',
  function (req, res, next) {
    //   console.log('logging in');
      next()
  },
  passport.authenticate('local'),
  (req, res,next) => {
      console.log('logged in', req.user);

      var userInfo = {
          id: req.user._id,
          username: req.user.username
      };

      res.send(req.user)
      res.status(200).json(req.user)
  }
)

router.get('/private', middlewares.isAuthenticated, (req, res, next) => {
  console.log(req.session);
  console.log("this is req user:", req.user);
// console.log('===== user!!======')
// console.log(req.user);
  res.send(req.user);
// res.status(200).json(req.session)


})

router.post('/logout', (req, res) => {
  if (req.user) {
      req.logout()
      res.status(200).json(req.user)
  } else {
    createError(403, "this user is already logged-out");
  }
})

router.post('/upvote/:id', middlewares.isAuthenticated, (req,res,next) =>{
  User.findOneAndUpdate(
  { _id: req.params.id},
  { $push: { reviewsUpvoted: [req.body.reviewId] }}, 
  { new: true })
  .then(user => {
      res.status(201).json(user)
  })
  .catch(next)
})

router.post('/downvote/:id', middlewares.isAuthenticated,(req,res,next) =>{
  User.findOneAndUpdate(
  { _id: req.params.id},
  { $push: { reviewsDownvoted: [req.body.reviewId] }}, 
  { new: true })
  .then(user => {
      res.status(201).json(user)
  })
  .catch(next)
})

router.post('/pull/downvote/:id', middlewares.isAuthenticated, (req,res,next)=>{
  User.findOneAndUpdate(
    { _id: req.params.id},
    { $pull: { reviewsDownvoted: req.body.reviewId }}, 
    { new: true })
    .then(user => {
        res.status(201).json(user)
    })
    .catch(next)
})

router.post('/pull/upvote/:id',middlewares.isAuthenticated, (req,res,next) =>{
  User.findOneAndUpdate(
    { _id: req.params.id},
    { $pull: { reviewsUpvoted: req.body.reviewId }}, 
    { new: true })
    .then(user => {
        res.status(201).json(user)
    })
    .catch(next)
})

module.exports = router;
