const chai = require('chai'),
  dictum = require('dictum.js'),
  nock = require('nock'),
  server = require('./../app'),
  expect = chai.expect,
  config = require('../config'),
  { saveUser, login, userOne } = require('./util'),
  { albums } = require('./albumsMocker'),
  should = chai.should();

describe('albums', () => {
  beforeEach(() => {
    nock(config.common.albumsApi.url)
      .get('')
      .reply(200, albums);
  });

  describe('/albums/ GET', () => {
    it('should list albums without problems because are loged', done => {
      saveUser(userOne).then(() => {
        login({
          email: 'pepito.perez@wolox.com',
          password: 'Holahola23'
        }).then(res => {
          chai
            .request(server)
            .get('/albums/')
            .set(config.common.session.header_name, res.headers[config.common.session.header_name])
            .then(result => {
              result.should.have.status(200);
              result.should.be.json;
              expect(result).to.be.a('object');
              result.body[0].should.have.property('userId');
              expect(result.body[0].userId).to.be.equal(1);
              expect(result.body[0].title).to.be.equal('quidem molestiae enim');
              dictum.chai(result, 'get albums');
              done();
            });
        });
      });
    });

    it('should fail list albums because token is no sent or user is no loged', done => {
      chai
        .request(server)
        .get('/albums/')
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
});