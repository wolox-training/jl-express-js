const chai = require('chai'),
  dictum = require('dictum.js'),
  server = require('./../app'),
  should = chai.should();

describe('users', () => {
  describe('/users/ POST', () => {
    it('should create a new user without problems', () => {
      return chai
        .request(server)
        .post('/users/')
        .send({
          firstName: 'pepito',
          lastName: 'perez',
          email: 'pepito.perez@wolox.com',
          password: 'Holahola23'
        })
        .then(res => {
          res.should.have.status(201);
          dictum.chai(res);
        });
    });

    it('should fail, email already in use for another user', () => {
      return chai
        .request(server)
        .post('/users/')
        .send({
          firstName: 'pepito',
          lastName: 'perez',
          email: 'pepito.perez@wolox.com',
          password: 'Holahola23'
        })
        .catch(err => {
          err.should.have.status(400);
          err.response.should.be.json;
          err.response.body.should.have.property('message');
          err.response.body.should.have.property('internal_code');
        });
    });

    it('should fail, missing field', () => {
      return chai
        .request(server)
        .post('/users')
        .send({
          firstName: 'pepito',
          email: 'pepito.perez@wolox.com',
          password: 'Holahola23'
        })
        .catch(err => {
          err.should.have.status(400);
          err.response.should.be.json;
          err.response.body.should.have.property('message');
          err.response.body.should.have.property('internal_code');
        });
    });

    it('should fail, email is not valid', () => {
      return chai
        .request(server)
        .post('/users/')
        .send({
          firstName: 'pepito',
          lastName: 'perez',
          email: 'pepito.perez@wolo.com',
          password: 'Holahola23'
        })
        .catch(err => {
          err.should.have.status(400);
          err.response.should.be.json;
          err.response.body.should.have.property('message');
          err.response.body.should.have.property('internal_code');
        });
    });

    it('should fail, password is not valid', () => {
      return chai
        .request(server)
        .post('/users/')
        .send({
          firstName: 'pepito',
          lastName: 'perez',
          email: 'pepito.perez@wolox.com',
          password: 'Holahola'
        })
        .catch(err => {
          err.should.have.status(400);
          err.response.should.be.json;
          err.response.body.should.have.property('message');
          err.response.body.should.have.property('internal_code');
        });
    });
  });
});
