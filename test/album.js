const chai = require('chai'),
  dictum = require('dictum.js'),
  nock = require('nock'),
  server = require('./../app'),
  Album = require('../app/models').albums,
  User = require('../app/models').users,
  expect = chai.expect,
  config = require('../config'),
  { saveUser, login, userOne } = require('./util'),
  url = `${config.common.albumsApi.url}/albums`,
  { albums } = require('./mocker/albums'),
  { photos } = require('./mocker/photos'),
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
              err.response.should.be.json;
              err.response.body.should.have.property('message');
              err.response.body.should.have.property('internal_code');
              expect(err.response.body.internal_code).to.equal('albums_api_error');
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

    it('should fail because try to buy multiples times same album', done => {
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
            .then(() => {
              nock(`${url}/1`)
                .get('')
                .reply(200, mockedAlbum);

              chai
                .request(server)
                .post('/albums/1')
                .set(config.common.session.header_name, res.headers[config.common.session.header_name])
                .send({
                  id: res.body.id
                })
                .catch(err => {
                  err.should.have.status(400);
                  err.response.should.be.json;
                  err.response.body.should.have.property('message');
                  err.response.body.should.have.property('internal_code');
                  expect(err.response.body.internal_code).to.equal('album_order_error');
                  done();
                });
            });
        });
      });
    });

    it('should fail because the album is not found', done => {
      nock(`${url}/10`)
        .get('')
        .reply(404, 'missing album');

      saveUser(userOne).then(() => {
        login({
          email: 'pepito.perez@wolox.com',
          password: 'Holahola23'
        }).then(res => {
          chai
            .request(server)
            .post('/albums/10')
            .set(config.common.session.header_name, res.headers[config.common.session.header_name])
            .send({
              id: res.body.id
            })
            .catch(err => {
              expect(err.response.request.req.res.body.message).to.be.equal(
                'Request failed with status code 404'
              );
              err.should.have.status(404);
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

  describe('/users/:user_id/albums GET', () => {
    it('should list all purchased albums without problems because are loged and is his id', done => {
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
            .then(() => {
              chai
                .request(server)
                .get(`/users/${res.body.id}/albums`)
                .set(config.common.session.header_name, res.headers[config.common.session.header_name])
                .then(async result => {
                  expect(result.body).to.be.a('array');
                  expect(result.body[0]).to.be.a('object');
                  expect(result.body[0].userId).to.be.equal(res.body.id);
                  dictum.chai(result, 'list all purchased albums');
                  done();
                });
            });
        });
      });
    });

    it('should fail list all purchased albums because is requesting the albums from other user', done => {
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
            .then(() => {
              chai
                .request(server)
                .get(`/users/2/albums`)
                .set(config.common.session.header_name, res.headers[config.common.session.header_name])
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
    });

    it('should list all purchased albums from other user because is an admin user', done => {
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
            .then(() => {
              const admin = new User({
                firstName: 'admin',
                lastName: 'user',
                email: 'admin.user@wolox.com',
                password: '$2b$10$o38Z3gJJLeKcMOYKuf1IV.P8jDKMU08Aa/dIw9k9fwS1z7y8TnC1S',
                permission: 'administrator'
              });

              admin.save().then(() => {
                login({
                  email: 'pepito.perez@wolox.com',
                  password: 'Holahola23'
                }).then(response => {
                  chai
                    .request(server)
                    .get(`/users/${res.body.id}/albums`)
                    .set(
                      config.common.session.header_name,
                      response.headers[config.common.session.header_name]
                    )
                    .then(async result => {
                      expect(result.body).to.be.a('array');
                      expect(result.body[0]).to.be.a('object');
                      done();
                    });
                });
              });
            });
        });
      });
    });
  });

  describe('/users/albums/:id/photos GET', () => {
    it('should list all albums photos without problems because user purchased the album', done => {
      const [mockedPhoto] = photos,
        [mockedAlbum] = albums;

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
            .then(() => {
              nock(`${url}/1/photos`)
                .get('')
                .reply(200, mockedPhoto);

              chai
                .request(server)
                .get(`/users/albums/1/photos`)
                .set(config.common.session.header_name, res.headers[config.common.session.header_name])
                .then(async result => {
                  result.should.have.status(200);
                  expect(result.body).to.be.a('object');
                  expect(result.body.id).to.be.equal(1);
                  dictum.chai(result, 'list all album photos from purchased albums by user');
                  done();
                });
            });
        });
      });
    });

    it('should fail list album photos because the user do not have this album yet', done => {
      saveUser(userOne).then(() => {
        login({
          email: 'pepito.perez@wolox.com',
          password: 'Holahola23'
        }).then(res => {
          chai
            .request(server)
            .get(`/users/albums/1/photos`)
            .set(config.common.session.header_name, res.headers[config.common.session.header_name])
            .catch(err => {
              err.should.have.status(404);
              err.response.should.be.json;
              err.response.body.should.have.property('message');
              err.response.body.should.have.property('internal_code');
              expect(err.response.body.internal_code).to.equal('album_not_found');
              done();
            });
        });
      });
    });

    it('should fail list album photos because the service is fail', done => {
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
            .then(() => {
              nock(`${url}/1/photos`)
                .get('')
                .reply(503);

              chai
                .request(server)
                .get(`/users/albums/1/photos`)
                .set(config.common.session.header_name, res.headers[config.common.session.header_name])
                .catch(err => {
                  err.should.have.status(503);
                  err.response.should.be.json;
                  err.response.body.should.have.property('message');
                  err.response.body.should.have.property('internal_code');
                  expect(err.response.body.internal_code).to.equal('albums_api_error');
                  done();
                });
            });
        });
      });
    });
  });
});
