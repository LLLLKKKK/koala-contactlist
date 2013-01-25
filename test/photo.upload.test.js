var app = require('../app')
  , request = require('supertest');

describe('Photo upload test', function() {
    
  it('it should print out the link of the photo', function(done) {
    request(app)
      .post('/photo')
      .attach('photo', 'test/dummy.png')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        console.log(res.text);
        done();
      })
  });

})