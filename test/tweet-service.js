// This class encapsulates the client side of the tweet api.
// It is layered on top of the SyncHttpClient class, and delivers
// a simplified interface to the unit tests

'use strict';

const SyncHttpService = require('./sync-http-service');
const baseUrl = 'https://gary:4000';

class TweetService {

  constructor(baseUrl) {
    this.httpService = new SyncHttpService(baseUrl);
  }

  //tweets///////////////////////////
  getTweets() {
    return this.httpService.get('/api/tweets');
  }

  getTweet(id) {
    return this.httpService.get('/api/tweets/' + id);
  }

  createTweet(newTweet) {
    return this.httpService.post('/api/tweets', newTweet);
  }

  deleteOneTweet(id) {
    return this.httpService.delete('/api/tweets/' + id);
  }

  deleteAllTweets() {
    return this.httpService.delete('/api/tweets');
  }

  //users/////////////////////////////

  getUsers() {
    return this.httpService.get('/api/users');
  }

  getUser(id) {
    return this.httpService.get('/api/users/' + id);
  }

  createUser(newUser) {
    return this.httpService.post('/api/users', newUser);
  }

  deleteAllUsers() {
    return this.httpService.delete('/api/users');
  }

  deleteOneUser(id) {
    return this.httpService.delete('/api/users/' + id);
  }

  authenticate(user) {
    return this.httpService.post('/api/users/authenticate', user);
  }

}

module.exports = TweetService;
