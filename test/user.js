const chai = require('chai'),
  dictum = require('dictum.js'),
  server = require('./../app'),
  User = require('../app/models').users,
  expect = chai.expect,
  should = chai.should();

describe('users', () => {
  describe('/users/ POST', () => {
    it('should create a new user without problems', done => {
      chai
        .request(server)
        .post('/users/')
        .send({
          firstName: 'pepito',
          lastName: 'perez',
          email: 'pepito.perez@wolox.com',
          password: 'Holahola23'
        })
        .then(async res => {
          res.should.have.status(201);
          const users = await User.find({
            where: {
              firstName: 'pepito',
              lastName: 'perez',
              email: 'pepito.perez@wolox.com'
            }
          });

          expect(users).to.be.a('object');
          expect(users.password).to.not.equal('12345678a');
          expect(users.firstName).to.be.a('string');
          expect(users.firstName).to.be.equal('pepito');
          expect(users.email).to.be.equal('pepito.perez@wolox.com');
          dictum.chai(res, 'create a new user');
          done();
        });
    });

    it('should fail, email already in use for another user', done => {
      chai
        .request(server)
        .post('/users/')
        .send({
          firstName: 'pepito',
          lastName: 'perez',
          email: 'pepito.perez@wolox.com',
          password: 'Holahola23'
        })
        .then(() => {
          chai
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
              expect(err.response.body.internal_code).to.equal('signup_error');
              done();
            });
        });
    });

    it('should fail creation of user because missing field in the request', done => {
      chai
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
          expect(err.response.body.internal_code).to.equal('signup_error');
          done();
        });
    });

    it('should fail creation of user because email is not valid', done => {
      chai
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
          expect(err.response.body.internal_code).to.equal('signup_error');
          done();
        });
    });

    it('should fail creation of user because password is not valid', done => {
      chai
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
          expect(err.response.body.internal_code).to.equal('signup_error');
          done();
        });
    });
  });

  describe('/users/sessions/ POST', () => {
    it('should login an user without problems', done => {
      chai
        .request(server)
        .post('/users/')
        .send({
          firstName: 'pepito',
          lastName: 'perez',
          email: 'pepito.perez@wolox.com',
          password: 'Holahola23'
        })
        .then(() => {
          chai
            .request(server)
            .post('/users/sessions/')
            .send({
              email: 'pepito.perez@wolox.com',
              password: 'Holahola23'
            })
            .then(res => {
              res.header.should.have.property('auth');
              res.should.have.status(200);
              dictum.chai(res, 'login an user');
              done();
            });
        });
    });

    it('should fail login a user because the email is not registered', done => {
      chai
        .request(server)
        .post('/users/')
        .send({
          firstName: 'pepito',
          lastName: 'perez',
          email: 'pepito.perez@wolox.com',
          password: 'Holahola23'
        })
        .then(() => {
          chai
            .request(server)
            .post('/users/sessions/')
            .send({
              email: 'pepito.paez@wolox.com',
              password: 'Holahola23'
            })
            .catch(err => {
              err.should.have.status(404);
              err.response.should.be.json;
              err.response.body.should.have.property('message');
              err.response.body.should.have.property('internal_code');
              expect(err.response.body.internal_code).to.equal('signin_error');
              done();
            });
        });
    });

    it('should fail login an user because password is not valid', done => {
      chai
        .request(server)
        .post('/users/sessions/')
        .send({
          email: 'pepito.perez@wolox.com',
          password: 'Holahola'
        })
        .catch(err => {
          err.should.have.status(404);
          err.response.should.be.json;
          err.response.body.should.have.property('message');
          err.response.body.should.have.property('internal_code');
          expect(err.response.body.internal_code).to.equal('signin_error');
          done();
        });
    });

    it('should fail login an user because email is not valid', done => {
      chai
        .request(server)
        .post('/users/sessions/')
        .send({
          email: 'pepito.perez@wolo.com',
          password: 'Holahola23'
        })
        .catch(err => {
          err.should.have.status(404);
          err.response.should.be.json;
          err.response.body.should.have.property('message');
          err.response.body.should.have.property('internal_code');
          expect(err.response.body.internal_code).to.equal('signin_error');
          done();
        });
    });

    it('should fail login an user because email is not registered', done => {
      chai
        .request(server)
        .post('/users/sessions/')
        .send({
          email: 'pepito.perez@wolox.com',
          password: 'Holahola23'
        })
        .catch(err => {
          err.should.have.status(404);
          err.response.should.be.json;
          err.response.body.should.have.property('message');
          err.response.body.should.have.property('internal_code');
          expect(err.response.body.internal_code).to.equal('signin_error');
          done();
        });
    });
  });
});
