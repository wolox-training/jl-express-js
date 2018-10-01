const chai = require('chai'),
  dictum = require('dictum.js'),
  server = require('./../app'),
  User = require('../app/models').users,
  should = chai.should();

beforeEach(async function() {
  await User.deleteAll();
});

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
        .then(async res => {
          res.should.have.status(201);
          const users = await User.find({
            where: {
              firstName: 'pepito',
              lastName: 'perez',
              email: 'pepito.perez@wolox.com'
            }
          });

          chai.expect(users).to.be.a('object');
          chai.expect(users.password).to.not.equal('12345678a');
          chai.expect(users.firstName).to.be.a('string');
          chai.expect(users.firstName).to.be.equal('pepito');
          chai.expect(users.email).to.be.equal('pepito.perez@wolox.com');

          dictum.chai(res, 'create a new user');
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
        .then(() => {
          return chai
            .request(server)
            .post('/users/')
            .send({
              firstName: 'pepito',
              lastName: 'perez',
              email: 'pepito.perez@wolox.com',
              password: 'Holahola23'
            });
        })
        .catch(err => {
          err.should.have.status(400);
          err.response.should.be.json;
          err.response.body.should.have.property('message');
          err.response.body.should.have.property('internal_code');
        });
    });

    it('should fail creation of user because missing field in the request', () => {
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

    it('should fail creation of user because email is not valid', () => {
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

    it('should fail creation of user because password is not valid', () => {
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
