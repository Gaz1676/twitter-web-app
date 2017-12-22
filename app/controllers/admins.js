/**
 * Author: Gary Fleming
 * Student No: 20019497
 * Start Date: Oct 10th 2017
 */

'use strict';

const Joi = require('joi');
const User = require('../models/user');
const Tweet = require('../models/tweet');
const Bcrypt = require('bcrypt');
const saltRounds = 10;

// admins home page
exports.adminHome = {
  handler: function (request, reply) {
    User.find({}).populate('user').then(allUsers => {
        Tweet.find({}).populate('user').sort({ date: 'desc' }).then(allTweets => {
            reply.view('adminhome', {
                title: 'Admin - All Users',
                users: allUsers,
                tweets: allTweets,
                avgUsersTweets: (allTweets.length / allUsers.length).toString().substring(0, 3),

              });
          }).catch(err => {
            console.log(err);
            reply.redirect('/');
          });
      });
  },
};

// admin creates a new user
exports.createUser = {
  auth: false,
  handler: function (request, reply) {
    reply.view('createuser', { title: 'Create New User' });
  },
};


// admin registers a new user to mongo database
// error checking validation done through Joi
// makes sure names are present / email not used & password length ok
exports.registerUser = {
  validate: {

      payload: {
          firstName: Joi.string().regex(/^[A-Z][a-z]{2,}$/).required(),
          lastName: Joi.string().regex(/^[A-Z]/).min(3).required(),
          email: Joi.string().email({ unique: true }).required(),
          password: Joi.string().min(6).max(20).required(),
        },

      failAction: function (request, reply, source, error) {
        reply.view('adminhome', {
          title: 'Failed to Register User',
          errors: error.data.details,
        }).code(400);
      },
    },
  auth: false,
  handler: function (request, reply) {
      const user = new User(request.payload);
      const plaintextPassword = user.password;

      Bcrypt.hash(plaintextPassword, saltRounds, function (err, hash) {
          user.password = hash;
          return user.save().then(newUser => {
              console.log(newUser);
              reply.redirect('/adminhome');
            }).catch(err => {
              console.log(err);
              reply.redirect('/');
            });
        });
    },
};


// admin views users page
exports.adminViewUser = {
  handler: function (request, reply) {
    const userId = request.params.id;

    User.findOne({ _id: userId }).then(user => {
        Tweet.find({ tweeter: userId }).populate('tweeter').then(allTweets => {
            reply.view('adminviewuser', {
                title: 'Tweets to Date for User',
                tweets: allTweets,
                user: user,
                id: userId,
              });
          }).catch(err => {
            console.log(err);
            reply.redirect('/');
          });
      });
  },
};

// admin removes a users tweet
exports.adminRemoveTweet = {
  handler: function (request, reply) {
    const tweets = Object.keys(request.payload);

    tweets.forEach(function (id) {
      Tweet.findByIdAndRemove(id, function (err) {
        if (err) throw err;
      });
    });
    reply.redirect('/adminhome');
  },
};


// admin removes all users tweets
exports.adminRemoveAllTweets = {
  handler: function (request, reply) {
    const userId = request.auth.credentials.loggedInUser;

    Tweet.remove({ tweeter: userId }).then(success => {
      console.log(success);
      reply.redirect('/adminhome');
    }).catch(err => {
      console.log(err);
      reply.redirect('/adminhome');
    });
  },
};


// admin removes a user
exports.removeUser = {
  handler: function (request, reply) {
    const userId = request.params.id;

    Tweet.remove({ tweeter: userId }).then(success => {
      console.log('Removed User' + success);
      return User.remove({ _id: userId });
    }).then(success => {
      console.log(success);
      reply.redirect('/adminhome');
    }).catch(err => {
      console.log('Error Removing User!' + err);
      reply.redirect('/adminhome');
    });
  },
};
