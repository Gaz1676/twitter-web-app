// Created to expose endpoints from the application

const User = require('../models/user');
const Boom = require('boom');

exports.create = {

    auth: false,

    handler: function (request, reply) {
        const user = new User(request.payload);
        user.save().then(newUser => {
            reply(newUser).code(201);
        }).catch(err => {
            reply(Boom.badImplementation('error creating user'));
        });
    },

};

exports.findOne = {

    auth: false,

    handler: function (request, reply) {
        User.findOne({ _id: request.params.id }).then(user => {
            if (user !== null) {
                reply(user);
            } else {
                reply(Boom.notFound('id not found'));
            }
        }).catch(err => {
            reply(Boom.notFound('id not found'));
        });
    },

};

exports.findAll = {

    auth: false,

    handler: function (request, reply) {
        User.find({}).exec().then(users => {
            reply(users);
        }).catch(err => {
            reply(Boom.badImplementation('error accessing db'));
        });
    },

};

exports.deleteAll = {

    auth: false,

    handler: function (request, reply) {
        User.remove({}).then(err => {
            reply().code(204);
        }).catch(err => {
            reply(Boom.badImplementation('error removing users'));
        });
    },

};

exports.deleteOne = {

    auth: false,

    handler: function (request, reply) {
        User.remove({ _id: request.params.id }).then(user => {
            reply(user).code(204);
        }).catch(err => {
            reply(Boom.notFound('id not found'));
        });
    },

};