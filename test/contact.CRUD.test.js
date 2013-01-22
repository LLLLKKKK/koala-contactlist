
var app = require('../app')
  , request = require('supertest')
  , lastContactID;

describe('Contact CRUD Test', function() {
 
  describe('POST /contacts', function() {
    
    it('should return an error', function(done) {
      request(app)
        .post('/contacts')
        .send({})
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
          lastContactID = res.body._id;
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
        .expect(new RegExp(lastContactID))
        .end(function(err, res) {
          if (err) return done(err);
          done();          
        })
    })
  })

  describe('GET /contacts:id', function() {
 
     it('should return an error', function(done) {
      request(app)
        .get('/contacts/'+ 'wtf?')
        .expect(500)
        .expect('Content-Type', /application\/json/)
        .expect(/error/, done);
    })

    it('should return the newly added contact', function(done) {
      request(app)
        .get('/contacts/'+ lastContactID)
        .expect(200)
        .expect('Content-Type', /application\/json/)
        .expect(new RegExp(lastContactID))
        .end(function(err, res) {
          if (err) return done(err);
          done();
        })
    })

  })

  describe('PUT /contacts:id', function() {
 
     it('should return an error', function(done) {
      request(app)
        .put('/contacts/'+ 'wtf?')
        .send({ firstname: ''})
        .expect(500)
        .expect(/error/, done);
    })

    it('should return the updated contact', function(done) {
      request(app)
        .put('/contacts/'+ lastContactID)
        .send({ firstname: 'wtfwtf'})
        .expect(200)
        .expect('Content-Type', /application\/json/)
        .expect(/wtfwtf/, done)
    })

  })

  describe('DELETE /contacts:id', function() {
 
     it('should return an error', function(done) {
      request(app)
        .del('/contacts/'+ 'wtf?')
        .expect(500)
        .expect(/error/, done);
    })

    it('should return success', function(done) {
      request(app)
        .del('/contacts/'+ lastContactID)
        .expect(200)
        .expect(/success/, done);
    })

  })

})