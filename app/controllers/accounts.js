/**
 * Author: Gary Fleming
 * Student No: 20019497
 * Start Date: Oct 10th 2017
 */

'use strict';

const Joi = require('joi');
const User = require('../models/user');


// route to render main welcome page
exports.main = {
  auth: false,
  handler: function (request, reply) {
    reply.view('main', { title: 'Welcome to Twitter' });
  },
};


// routes to render signup page
exports.signup = {
  auth: false,
  handler: function (request, reply) {
    reply.view('signup', { title: 'Sign up for Twitter' });
  },
};


// routes to render login page
exports.login = {
  auth: false,
  handler: function (request, reply) {
    reply.view('login', { title: 'Login to Twitter' });
  },
};


// registers user to mongo database
// error checking validation done through Joi
// makes sure names are present & email not used & password length ok
exports.register = {
  validate: {

    payload: {
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email({ unique: true }).required(),
      password: Joi.string().min(6).max(20).required(),
    },

    failAction: function (request, reply, source, error) {
      reply.view('signup', {
        title: 'Sign up error',
        errors: error.data.details,
      }).code(400);
    },
  },

  auth: false,
  handler: function (request, reply) {
    const user = new User(request.payload);

    user.save().then(newUser => {
      reply.redirect('/login');
    }).catch(err => {
      reply.redirect('/');
    });
  },
};


// authenticates the user through validated login / password credentials
// error checking validation done through Joi
// makes sure a valid email / password is used
exports.authenticate = {
  validate: {

    payload: {
      email: Joi.string().email({ unique: true }).required(),
      password: Joi.string().min(6).max(20).required(),
    },
    failAction: function (request, reply, source, error) {
      reply.view('login', {
        title: 'Login error and now',
        errors: error.data.details,
      }).code(400);
    },
  },

  auth: false,
  handler: function (request, reply) {
    const user = request.payload;

    if (user.email === 'tim@tom.com' && user.password === 'secret') {
      request.cookieAuth.set({
        loggedIn: true,
        LoggedInUser: user.email,
      });
      reply.redirect('/adminhome');
    } else {
      User.findOne({ email: user.email }).then(user => {
        if (user && user.password === user.password) {
          request.cookieAuth.set({
            loggedIn: true,
            loggedInUser: user._id,
          });
          reply.redirect('/globaltweets');
        } else {
          reply.redirect('/signup');
        }
      }).catch(err => {
        reply.redirect('/');
      });
    }
  },
};


// routes to render logout page
// clears cookies
exports.logout = {
  auth: false,
  handler: function (request, reply) {
    request.cookieAuth.clear();
    reply.redirect('/');
  },
};


// routes to render about page
exports.about = {
  auth: false,
  handler: function (request, reply) {
    reply.view('about', { title: 'About Twitter' });
  },
};


// routes to render view settings page
exports.viewSettings = {
  handler: function (request, reply) {
    let userId = request.auth.credentials.loggedInUser;
    User.findOne({ _id: userId }).then(user => {
      reply.view('settings', { title: 'Edit Account Settings', user: user });
    }).catch(err => {
      reply.redirect('/');
    });
  },
};


// routes to render update settings page
// error checking validation done through Joi
// makes sure names, email are present & password length ok
exports.updateSettings = {
  validate: {

    payload: {
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email({ unique: true }).required(),
      password: Joi.string().min(6).max(20).required(),
    },

    failAction: function (request, reply, source, error) {
      reply.view('settings', {
        title: 'Settings error',
        errors: error.data.details,
      }).code(400);
    },
  },
  handler: function (request, reply) {
    const editedUser = request.payload;
    let userId = request.auth.credentials.loggedInUser;
    User.findOne({ _id: userId }).then(user => {
      user.firstName = editedUser.firstName;
      user.lastName = editedUser.lastName;
      user.email = editedUser.email;
      user.password = editedUser.password;
      return user.save();
    }).then(user => {
      reply.view('settings', { title: 'Edit Account Settings', user: user });
    });
  },
};


// for uploading a users profile pic
exports.profile_picture = {

  handler: function (request, reply) {
    let userId = request.auth.credentials.loggedInUser;
    let userPic = request.payload.picture;
    User.findOne({ _id: userId }).then(user => {
      if (userPic.length) {
        user.picture.data = userPic;
        user.save();
      }
      reply.redirect('/settings');
    }).catch(err => {
      reply.redirect('/');
    });
  },
};


exports.getUserPicture = {
  handler: function (request, reply) {
    let userId = request.params.id;
    User.findOne({ _id: userId }).then(user => {
      reply(user.picture.data).type('image');
    }).catch(err => {
      reply.redirect('/');
    });
  },
};
