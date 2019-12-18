'use strict';

const graphqlHTTP = require('express-graphql'),
  { schema, root } = require('./schemas/album'),
  { singUp, singIn, userList, singUpAdmins, invalidateAll } = require('./controllers/user'),
  { albumList, buyAnAlbum, listPurchasedAlbums, listAlbumsPhotos } = require('./controllers/album'),
  { verifyToken, verifyPermission, verifyAccessLevel } = require('./middlewares/auth');

exports.init = app => {
  app.post('/users/', singUp);
  app.post('/users/sessions/', singIn);
  app.get('/users/', verifyToken, userList);
  app.get('/albums/', verifyToken, albumList);
  app.post('/albums/:id', verifyToken, buyAnAlbum);
  app.get('/users/:user_id/albums', [verifyToken, verifyAccessLevel], listPurchasedAlbums);
  app.get('/users/albums/:id/photos', verifyToken, listAlbumsPhotos);
  app.post('/admin/users/', [verifyToken, verifyPermission], singUpAdmins);
  app.post('/users/sessions/invalidate_all', invalidateAll);

  app.use(
    '/graphql',
    graphqlHTTP({
      // schema: '/schemas/schema.graphql',
      schema,
      rootValue: root,
      graphiql: true
    })
  );
};
