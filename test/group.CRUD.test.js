var app = require('../app')
  , request = require('supertest')
  , lastGroupID;

describe('Group CRUD Test', function() {
  
  describe('POST /groups', function() {
    
    it('should return an error', function(done) {
      request(app)
        .post('/groups')
        .send({ })
        .expect(500)
        .expect(/error/, done)
    });

    it('should create a new group and return', function(done) {
      request(app)
        .post('/groups')
        .send({ group : 'testgroup'})
        .expect(200)
        .expect('Content-Type', /application\/json/)
        .expect(/testgroup/)
        .end(function(err, res) {
          if (err) return done(err);
          lastGroupID = res.body._id;
          done();
        })
    });

  })

  describe('GET /groups', function() {

    it('should return the list of group', function(done) {
      request(app)
        .get('/groups')
        .expect(200)
        .expect('Content-Type', /application\/json/)
        .expect(new RegExp(lastGroupID), done)
    })

  })

  describe('GET /groups/:id', function() {

    it('should return an error', function(done) {
      request(app)
        .get('/groups/' + 'wtf?')
        .send({ })
        .expect(500)
        .expect(/error/, done)
    });

    it('should return the list of contacts', function(done) {
      request(app)
        .get('/groups/' + lastGroupID)
        .expect(200)
        .expect('Content-Type', /application\/json/)
        .expect(new RegExp(lastGroupID), done)
    })

  })

  describe('PUT /groups/:id', function() {
    
    it('should return an error', function(done) {
      request(app)
        .put('/groups/' + 'wtf?')
        .send({ })
        .expect(500)
        .expect(/error/, done)
    });

    it('should return the list of contacts', function(done) {
      request(app)
        .put('/groups/' + lastGroupID)
        .send({ group : 'newgroupname'})
        .expect(200)
        .expect('Content-Type', /application\/json/)
        .expect(/newgroupname/, done)
    })
  
  })

  describe('DELETE /groups/:id', function() {
    
    it('should return an error', function(done) {
      request(app)
        .del('/groups/' + 'wtf?')
        .send({ })
        .expect(500)
        .expect(/error/, done)
    });

    it('should return the list of contacts', function(done) {
      request(app)
        .del('/groups/' + lastGroupID)
        .expect(200)
        .expect('success', done)
    })
  
  })

})