const faker = require('faker');

const generateTracks = () =>  JSON.stringify([{
    track: faker.lorem.paragraph(),
    url: faker.image.imageUrl(),
    lyrics: faker.lorem.paragraph()
}])

const writeAlbumData = (start, stop, output) => {
    for (var j = start; j <= stop; j++) {
      if (j % 100000 === 0) { console.log('j: ', j) }
      var id = j;
      var artist = faker.random.words();
      var albumTitle = faker.random.words();
      var tracks = generateTracks()
      var artistDescription = faker.lorem.paragraph();
      var coverArt = faker.image.imageUrl();
      output.push({
        id,
        artist,
        albumTitle,
        tracks,
        artistDescription,
        coverArt,
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }
}

const generateData = () => {
  var one_million = 1000000;
  var start = 1;
  var stop = one_million;
  var output = []
  for (var i = 1; i <= 10; i++) {
    writeAlbumData(start, stop, output);
    start += one_million;
    stop += one_million;
  }
  return output
}

module.exports = generateData