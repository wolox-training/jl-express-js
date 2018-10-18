const chai = require('chai'),
  dictum = require('dictum.js'),
  nock = require('nock'),
  server = require('./../app'),
  Album = require('../app/models').albums,
  expect = chai.expect,
  config = require('../config'),
  { saveUser, login, userOne } = require('./util'),
  url = `${config.common.albumsApi.url}/albums`,
  url2 = `${config.common.albumsApi.url}/albums/1`,
  { albums } = require('./albumsMocker'),
  should = chai.should();

describe('albums', () => {
  describe('/albums/ GET', () => {
    it('should list albums without problems because are loged', done => {
      nock(url)
        .get('')
        .reply(200, albums);

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
              expect(result.body.length).to.equal(albums.length);
              result.body[0].should.have.property('userId');
              expect(result.body[0].userId).to.be.equal(1);
              expect(result.body[0].title).to.be.equal('quidem molestiae enim');
              dictum.chai(result, 'get albums');
              done();
            });
        });
      });
    });

    it('should fail list albums because the service fail', done => {
      nock(url)
        .get('')
        .reply(503);

      saveUser(userOne).then(() => {
        login({
          email: 'pepito.perez@wolox.com',
          password: 'Holahola23'
        }).then(res => {
          chai
            .request(server)
            .get('/albums/')
            .set(config.common.session.header_name, res.headers[config.common.session.header_name])
            .catch(err => {
              err.should.have.status(503);
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

  describe('/albums/:id POST', () => {
    it('should order an albums without problems because are loged', done => {
      const [mockedAlbum] = albums;

      nock(`${url}/1`)
        .get('')
        .reply(200, mockedAlbum);

      saveUser(userOne).then(() => {
        login({
          email: 'pepito.perez@wolox.com',
          password: 'Holahola23'
        }).then(res => {
          chai
            .request(server)
            .post('/albums/1')
            .set(config.common.session.header_name, res.headers[config.common.session.header_name])
            .send({
              id: res.body.id
            })
            .then(async result => {
              const album = await Album.find({
                where: {
                  albumId: 1,
                  userId: 1
                }
              });
              expect(album).to.be.a('object');
              expect(album.albumId).to.be.equal(1);
              expect(album.userId).to.be.equal(1);
              dictum.chai(result, 'buy an album');
              done();
            });
        });
      });
    });

    it('should fail order an albums because the service fail', done => {
      nock(`${url}/1`)
        .get('')
        .reply(503);

      saveUser(userOne).then(() => {
        login({
          email: 'pepito.perez@wolox.com',
          password: 'Holahola23'
        }).then(res => {
          chai
            .request(server)
            .post('/albums/1')
            .set(config.common.session.header_name, res.headers[config.common.session.header_name])
            .send({
              id: res.body.id
            })
            .catch(err => {
              err.should.have.status(503);
              done();
            });
        });
      });
    });

    it('should fail order an album because token is no sent or user is no loged', done => {
      chai
        .request(server)
        .post('/albums/1')
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
