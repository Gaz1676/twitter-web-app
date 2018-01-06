'use strict';

const User = require('../models/user');
const Boom = require('boom');
const utils = require('./utils.js');
const bcrypt = require('bcrypt');
const saltRounds = 10;


exports.find = {

    auth: false,
    handler: function (request, reply) {
        User.find({}).exec().then(users => {
            reply(users);
          }).catch(err => {
            reply(Boom.badImplementation('error accessing db'));
          });
      },
  };


exports.findOne = {

    auth: false,
    handler: function (request, reply) {
        User.findOne({ _id: request.params.id }).then(user => {
            if (user != null) {
              reply(user);
            } else {
              reply(Boom.notFound('id not found'));
            }
          }).catch(err => {
            reply(Boom.notFound('id not found'));
          });
      },
  };


exports.create = {

    auth: false,
    handler: function (request, reply) {
        const user = new User(request.payload);
        bcrypt.hash(user.password, saltRounds, function (err, hash) {
            user.password = hash;
            user.save().then(newUser => {
                reply(newUser).code(201);
              }).catch(err => {
                reply(Boom.badImplementation('error creating User'));
              });
          });
      },
  };


exports.update = {

    auth: false,
    handler: function (request, reply) {
        const user = User(request.payload);
        console.log(user);
        user.update(user).then(updatedUser => {
            reply(updatedUser).code(201);
          }).catch(err => {
            reply(Boom.badImplementation('error updating User'));
          });
      },
  };


exports.deleteAll = {

    auth: false,
    handler: function (request, reply) {
        User.remove({}).then(err => {
            reply().code(204);
          }).catch(err => {
            reply(Boom.badImplementation('error removing Users'));
          });
      },
  };


exports.deleteOne = {

    auth: false,
    handler: function (request, reply) {
        User.remove({ _id: request.params.id }).then(user => {
            reply(User).code(204);
          }).catch(err => {
            reply(Boom.notFound('id not found'));
          });
      },
  };


exports.authenticate = {

    auth: false,
    handler: function (request, reply) {
        const user = request.payload;
        User.findOne({ email: user.email }).then(foundUser => {
            bcrypt.compare(user.password, foundUser.password, function (err, isUser) {
                if (isUser) {
                  reply(foundUser).code(201);
                } else {
                  reply(Boom.notFound('internal db failure'));
                }
              }).catch(err => {
                reply(Boom.notFound('internal db failure'));
              });
          });
      },
  };
