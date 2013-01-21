
process.env.NODE_ENV = 'test';

var app = require('../app')
  , lastID;

module.exports = {
  'GET /': function(beforeExit, assert) {
    assert.response(app, {
      url: '/',
      method: 'GET',
      timeout: 500
    }, {
      status: 200
    });
  } /*,

  'POST /contacts.json': function(beforeExit, assert) {
    assert.response(app, {
      url: '/contacts.json',
      method: 'POST',
      data: JSON.stringify({
        firstname: 'test',
        lastname: 'test'
      }),
      headers: { 'Content-Type': 'application/json' }
    }, {
      status: 200,
      headers: { 'Content-Type': 'application/json'}
    }, function(res) {

    });
  }*/
}