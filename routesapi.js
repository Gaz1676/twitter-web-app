const TweetsApi = require('./app/api/tweetsapi');
const UsersApi = require('./app/api/usersapi');

module.exports = [
    { method: 'GET', path: '/api/users', config: UsersApi.find },
    { method: 'GET', path: '/api/users/{id}', config: UsersApi.findOne },
    { method: 'POST', path: '/api/users', config: UsersApi.create },
    { method: 'DELETE', path: '/api/users/{id}', config: UsersApi.deleteOne },
    { method: 'DELETE', path: '/api/users', config: UsersApi.deleteAll },

    { method: 'PUT', path: '/api/users', config: UsersApi.update },
    { method: 'POST', path: '/api/users/authenticate', config: UsersApi.authenticate },

    { method: 'GET', path: '/api/tweets', config: TweetsApi.find },
    { method: 'GET', path: '/api/tweets/{id}', config: TweetsApi.findOne },
    { method: 'POST', path: '/api/tweets', config: TweetsApi.create },
    { method: 'DELETE', path: '/api/tweets/{id}', config: TweetsApi.deleteOne },
    { method: 'DELETE', path: '/api/tweets', config: TweetsApi.deleteAll },
];
