/**
 * Author: Gary Fleming
 * Student No: 20019497
 * Start Date: Oct 10th 2017
 */

const TweetsApi = require('./app/api/tweetsapi');
const UsersApi = require('./app/api/usersapi');
const AdminsApi = require('./app/api/adminsapi');

module.exports = [

  // Tweet Routes
  {method: 'GET', path: '/api/tweets', config: TweetsApi.find},
  {method: 'GET', path: '/api/tweets/{id}', config: TweetsApi.findOne},
  {method: 'POST', path: '/api/tweets', config: TweetsApi.create},
  {method: 'DELETE', path: '/api/tweets/{id}', config: TweetsApi.deleteOne},
  {method: 'DELETE', path: '/api/tweets', config: TweetsApi.deleteAll},


  // User Routes
  {method: 'GET', path: '/api/users', config: UsersApi.find},
  {method: 'GET', path: '/api/users/{id}', config: UsersApi.findOne},
  {method: 'POST', path: '/api/users', config: UsersApi.create},
  {method: 'DELETE', path: '/api/users/{id}', config: UsersApi.deleteOne},
  {method: 'DELETE', path: '/api/users', config: UsersApi.deleteAll},


  // Admin Routes
  {method: 'GET', path: '/api/admins', config: AdminsApi.find},
  {method: 'GET', path: '/api/admins/{id}', config: AdminsApi.findOne},
  {method: 'POST', path: '/api/admins', config: AdminsApi.create},
  {method: 'DELETE', path: '/api/admins/{id}', config: AdminsApi.deleteOne},
  {method: 'DELETE', path: '/api/admins', config: AdminsApi.deleteAll},

];