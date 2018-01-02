/**
 * Author: Gary Fleming
 * Student No: 20019497
 * Date: Jan 7th 2018
 */

'use strict';

const Joi = require('joi');
const User = require('../models/user');
const Bcrypt = require('bcrypt');
const saltRounds = 10;


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
        reply.view('signup',
            { title: 'Sign up for Twitter' });
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
            firstName: Joi.string().regex(/^[A-Z][a-z]{2,}$/).required(),
            lastName: Joi.string().regex(/^[A-Z]/).min(3).required(),
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
        const plaintextPassword = user.password;

        Bcrypt.hash(plaintextPassword, saltRounds, function (err, hash) {
            user.password = hash;
            return user.save().then(newUser => {
                console.log(newUser);
                reply.redirect('/login');
              }).catch(err => {
                console.log(err);
                reply.redirect('/');
              });
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
          console.log('>> You are now logged in as Admin');
          reply.redirect('/adminhome');
        } else {

          User.findOne({ email: user.email }).then(foundUser => {
              Bcrypt.compare(user.password, foundUser.password, function (err, isValid) {
                  if (isValid) {
                    request.cookieAuth.set({
                        loggedIn: true,
                        loggedInUser: user.email,
                      });
                    console.log(`>> ` + user.email + ` is now logged in`);
                    reply.redirect('/globaltweets');
                  } else {
                    console.log(`>> Registration needed`);
                    reply.redirect('/signup');
                  }
                });
            }).catch(err => {
              console.log(`>> Registration needed` + err);
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
        console.log(`>> You are now logged out`);
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
        let loggedInUser = request.auth.credentials.loggedInUser;

        User.findOne({ email: loggedInUser }).then(user => {
            reply.view('settings', {
                title: 'Edit Account Settings',
                user: user,
              });
          }).catch(err => {
            console.log(err);
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
            firstName: Joi.string().regex(/^[A-Z][a-z]{2,}$/).required(),
            lastName: Joi.string().regex(/^[A-Z]/).min(3).required(),
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
        let loggedInUser = request.auth.credentials.loggedInUser;

        User.findOne({ email: loggedInUser }).then(user => {
            user.firstName = editedUser.firstName;
            user.lastName = editedUser.lastName;
            user.email = editedUser.email;
            Bcrypt.hash(editedUser.password, saltRounds, function (err, hash) {
                user.password = hash;
                user.save();
              });

            return user.save();
          }).then(user => {
            reply.view('settings', { title: 'Edit Account Settings', user: user });
          }).catch(err => {
            console.log(err);
            reply.redirect('/');
          });
      },
  };


// for uploading a users profile pic
// added joi validation as to not upload empty image
exports.profilePicture = {
    validate: {

        payload: {
            picture: Joi.any().required(),
          },

        failAction: function (request, reply, source, error) {
            reply.view('settings', {
                title: 'Upload Image error',
                errors: error.data.details,
              }).code(400);
          },
      },

    handler: function (request, reply) {
        let loggedInUser = request.auth.credentials.loggedInUser;
        let userPic = request.payload.picture;

        User.findOne({ email: loggedInUser }).then(user => {
            if (userPic.length) {
              user.picture.data = userPic;
              user.save();
            }

            reply.redirect('/settings');
          }).catch(err => {
            console.log(err);
            reply.redirect('/');
          });
      },
  };


// used to retrieve users icon picture
exports.getUserPicture = {
    handler: function (request, reply) {
        let userId = request.params.id;

        User.findOne({ _id: userId }).then(user => {
            reply(user.picture.data).type('image');
          }).catch(err => {
            console.log(err);
            reply.redirect('/');
          });
      },
  };
