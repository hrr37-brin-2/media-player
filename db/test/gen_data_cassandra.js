const faker = require('faker');
const cassandra = require('cassandra-driver');

let client = new cassandra.Client({
  contactPoints: ['localhost'],
  localDataCenter: 'datacenter1',
  keyspace: 'sdc_kaz',
  });

let chunkSize = 55;
let totalRecords = 10000000;
let rowsCount = 0;
let start = 1;
let end = chunkSize;

const writeRows = (rows) => {
  rowsCount += rows.length;
  let percentage = (rowsCount * 100) / totalRecords;
  console.log(`Generated records count ${rowsCount}. Progress - ${percentage} %`);
  query = "INSERT INTO albums (id, album_title, artist, artist_description, cover_art, created_at, tracks, updated_at) VALUES (?,?,?,?,?,?,?,?)"

  queries = []
  for (index=0;index<rows.length;index++) {
    queries.push(
      {
        query: query,
        params: rows[index]
      }
    )
  }

  client.batch(queries, { prepare: true }, function(err, result) {
    if (err) {
      console.log(err);
    } else {
      start = end + 1;
      end = start - 1 + chunkSize;
      generateData(start, end)
    }
  })
};

const generateTracks = () =>  JSON.stringify([{
    track: faker.lorem.paragraph(),
    url: faker.image.imageUrl(),
    lyrics: faker.lorem.paragraph()
}]);

const writeAlbumData = (start, stop) => {
  console.time("seed");
  let output = [];
  for (let j = start; j <= stop; j++) {
    let id = j;
    let artist = faker.random.words();
    let album_title = faker.random.words();
    let tracks = generateTracks()
    let artist_description = faker.lorem.paragraph();
    let coverart = faker.image.imageUrl();

    output.push([
      id,
      album_title,
      artist,
      artist_description,
      coverart,
      new Date(),
      tracks,
      new Date()
    ])
  }
  console.timeEnd("seed");
  writeRows(output)
};

const generateData = (start, end) => {
  if (start > totalRecords){
    return;
  } else {
    writeAlbumData(start, end);
  }
};

const query = "CREATE TABLE if not exists albums (id int primary key, artist text, album_title text, tracks text, artist_description text, cover_art text, created_at timestamp, updated_at timestamp )";

client.execute(query, function(err, result) {
  if (err) {
    console.log(err);
  } else {
    console.log("table available!");
    generateData(start, end)
  }
});