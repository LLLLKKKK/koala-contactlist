
var app = require('../app')
  , request = require('supertest')
  , lastContactID;

describe('Contact CRUD Test', function() {
  describe('POST /contacts', function() {
    
    it('should return an error', function(done) {
      request(app)
        .post('/contacts')
        .send({
          firstname: 'test',
          lastname: 'test'
        })
        .expect(500)
        .expect(/error/)
        .end(function(err, res) {
          if (err) return done(err);

          done();
        });
    })

    it('should create a contact', function(done) {
      request(app)
        .post('/contacts')
        .send({
          firstname: 'test',
          lastname: 'test',
          gender: 'male',
          photo: 'photo',
          phone: '123455',
          email: 'adsf@sf.sdf',
          group: 'asdfasdf',
          address: 'address'
        })
        .expect(200)
        .expect('Content-Type', /application\/json/)
        .expect(/test/)
        .end(function(err, res) {
          if (err) return done(err);
          lastID = res.body._id;
          console.log(res.body)
          done();
        });
    })

  })

  describe('GET /contacts', function() {
    
    it('should return the list of contacts', function(done) {
      request(app)
        .get('/contacts/')
        .expect(200)
        .expect('Content-Type', /application\/json/)
        .expect(/test/)
        .end(function(err, res) {
          if (err) return done(err);
          //console.log(res.body)
          done();          
        })
    })

    it('should return the last inserted contact', function(done) {
      request(app)
        .get('/contacts/'+ lastID)
        .expect(200)
        .expect('Content-Type', /application\/json/)
        .expect(new RegExp(lastID))
        .end(function(err, res) {
          if (err) return done(err);
          //console.log(res.body)
          done();
        })
    })
  })
})