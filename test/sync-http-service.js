// This class will encapsulate all lower level
// http request composition and transmission.
// The class assumes we are always dealing with JSON payloads.

let request = require('sync-request');

class SyncHttpService {

  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  get(url) {
    let returnedObj = null;
    let res = request('GET', this.baseUrl + url);
    if (res.statusCode < 300) {
      returnedObj = JSON.parse(res.getBody('utf8'));
    }

    return returnedObj;
  }

  post(url, obj) {
    let returnedObj = null;
    let res = request('POST', this.baseUrl + url, { json: obj });
    if (res.statusCode < 300) {
      returnedObj = JSON.parse(res.getBody('utf8'));
    }

    return returnedObj;
  }

  //  provides support for the delete operations in the encapsulated layers
  delete (url) {
    let res = request('DELETE', this.baseUrl + url);
    return res.statusCode;
  }
}

module.exports = SyncHttpService;
