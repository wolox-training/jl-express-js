const { buildSchema } = require('graphql'),
  { getResources } = require('../services/album'),
  albumSchema = './schema.graphql',
  { albums } = require('./mocker/albums');

exports.schema = buildSchema(` 
type Query {
    albums: [Album],
    album(id: Int!): Album
}

type Mutation {
    updateAlbum(id: Int!, title: String!): Album
}

type Album {
    userId: Int,
    id: Int,
    title: String
}
`);

const getAlbum = async args => {
  const allAlbums = await getResources('/albums');
  const id = args.id;
  return allAlbums.filter(album => album.id === id)[0];
};

const updateAlbum = ({ id, title }) => {
  albums.map(album => {
    if (album.id === id) {
      album.title = title;
      return album;
    }
    return 'Album no existe';
  });

  return albums.filter(album => album.id === id)[0];
};

exports.root = {
  albums: () => getResources('/albums'),
  album: getAlbum,
  updateAlbum
};
