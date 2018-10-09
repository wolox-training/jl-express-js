const chai = require('chai'),
  dictum = require('dictum.js'),
  server = require('./../app'),
  User = require('../app/models').users,
  expect = chai.expect,
  config = require('../config'),
  { saveUser, login, userOne, anotherUser } = require('./util'),
  should = chai.should();

describe('users', () => {
  describe('/users/ POST', () => {
    it('should create a new user without problems', done => {
      saveUser(userOne).then(async res => {
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
      saveUser(userOne).then(() => {
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
      saveUser(userOne).then(() => {
        login({
          email: 'pepito.perez@wolox.com',
          password: 'Holahola23'
        }).then(res => {
          res.header.should.have.property('authorization');
          res.should.have.status(200);
          dictum.chai(res, 'login an user');
          done();
        });
      });
    });

    it('should fail login a user because the email is not registered', done => {
      saveUser(userOne).then(() => {
        login({
          email: 'pepito.paez@wolox.com',
          password: 'Holahola23'
        }).catch(err => {
          err.should.have.status(400);
          err.response.should.be.json;
          err.response.body.should.have.property('message');
          err.response.body.should.have.property('internal_code');
          expect(err.response.body.internal_code).to.equal('signin_error');
          done();
        });
      });
    });

    it('should fail login an user because password is not valid', done => {
      login({
        email: 'pepito.perez@wolox.com',
        password: 'Holahola'
      }).catch(err => {
        err.should.have.status(400);
        err.response.should.be.json;
        err.response.body.should.have.property('message');
        err.response.body.should.have.property('internal_code');
        expect(err.response.body.internal_code).to.equal('signin_error');
        done();
      });
    });

    it('should fail login an user because email is not valid', done => {
      login({
        email: 'pepito.perez@wolo.com',
        password: 'Holahola23'
      }).catch(err => {
        err.should.have.status(400);
        err.response.should.be.json;
        err.response.body.should.have.property('message');
        err.response.body.should.have.property('internal_code');
        expect(err.response.body.internal_code).to.equal('signin_error');
        done();
      });
    });

    it('should fail login an user because email is not registered', done => {
      login({
        email: 'pepito.perez@wolox.com',
        password: 'Holahola23'
      }).catch(err => {
        err.should.have.status(400);
        err.response.should.be.json;
        err.response.body.should.have.property('message');
        err.response.body.should.have.property('internal_code');
        expect(err.response.body.internal_code).to.equal('signin_error');
        done();
      });
    });
  });

  describe('/users GET', () => {
    it('should list all users by pagination without problems because are loged', done => {
      saveUser(userOne).then(() => {
        login({
          email: 'pepito.perez@wolox.com',
          password: 'Holahola23'
        }).then(res => {
          chai
            .request(server)
            .get('/users?count=1&page=1')
            .set(config.common.session.header_name, res.headers[config.common.session.header_name])
            .then(result => {
              result.should.have.status(200);
              expect(result).to.be.a('object');
              expect(result.body.count).to.be.equal(1);
              expect(result.body.pages).to.be.equal(1);
              dictum.chai(result, 'get all user with pagination');
              done();
            });
        });
      });
    });

    it('should fail list all users by pagination because token is no sent sent', done => {
      chai
        .request(server)
        .get('/users?count=1&page=1')
        .catch(err => {
          err.should.have.status(401);
          err.response.should.be.json;
          err.response.body.should.have.property('message');
          err.response.body.should.have.property('internal_code');
          expect(err.response.body.internal_code).to.equal('authorization_error');
          done();
        });
    });
  });

  describe('/admin/users/ POST', () => {
    it('should fail because is not an admin requester', done => {
      saveUser(userOne).then(() => {
        login({
          email: 'pepito.perez@wolox.com',
          password: 'Holahola23'
        }).then(res => {
          chai
            .request(server)
            .post('/admin/users/')
            .set(config.common.session.header_name, res.headers[config.common.session.header_name])
            .send(anotherUser)
            .catch(err => {
              err.should.have.status(401);
              done();
            });
        });
      });
    });

    it('should signup an admin user without problems because the requester is admin', done => {
      const admin = new User({
        firstName: 'pepito',
        lastName: 'perez',
        email: 'pepito.perez@wolox.com',
        password: '$2b$10$o38Z3gJJLeKcMOYKuf1IV.P8jDKMU08Aa/dIw9k9fwS1z7y8TnC1S',
        permission: 'administrator'
      });

      admin.save().then(() => {
        login({
          email: 'pepito.perez@wolox.com',
          password: 'Holahola23'
        }).then(res => {
          chai
            .request(server)
            .post('/admin/users/')
            .set(config.common.session.header_name, res.headers[config.common.session.header_name])
            .send(anotherUser)
            .then(async result => {
              result.should.have.status(201);
              expect(result).to.be.a('object');

              const users = await User.find({
                where: {
                  firstName: 'pepito',
                  lastName: 'paez',
                  email: 'pepito.paez@wolox.com'
                }
              });

              expect(users).to.be.a('object');
              expect(users.password).to.not.equal('12345678a');
              expect(users.firstName).to.be.a('string');
              expect(users.firstName).to.be.equal('pepito');
              expect(users.email).to.be.equal('pepito.paez@wolox.com');
              expect(users.permission).to.be.equal('administrator');
              dictum.chai(result, 'create a new admin user');
              done();
            });
        });
      });
    });
  });
});
