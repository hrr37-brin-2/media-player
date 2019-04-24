const faker = require('faker');
var cassandra = require('cassandra-driver');

var client = new cassandra.Client({
  contactPoints: ['localhost'],
  localDataCenter: 'datacenter1',
  keyspace: 'sdc_andrew',
  });

let chunkSize = 55;
let totalRecords = 100000;
let rowsCount = 0;
let start = 1;
let end = chunkSize;

const writeRows = (rows) => {
  rowsCount += rows.length;
  let percentage = (rowsCount * 100) / totalRecords;
  console.log(`Generated records count ${rowsCount}. Progress - ${percentage} %`);
  let query = "INSERT INTO albums (id, album_title, artist, artist_description, cover_art, created_at, tracks, updated_at) VALUES (?,?,?,?,?,?,?,?)"

  queries = []
  for (index=0;index<rows.length;index++) {
    queries.push(
      {
        query: query,
        params: rows[index]
      }
    )
  };

  start = new Date().getTime();
  // run the query here
  end = new Date().getTime()
  timeTaken = end - start; //ms

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
  var output = [];
  for (var j = start; j <= stop; j++) {
    var id = j;
    var artist = faker.random.words();
    var album_title = faker.random.words();
    var tracks = generateTracks()
    var artist_description = faker.lorem.paragraph();
    var coverart = faker.image.imageUrl();

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
    console.log("GEtting last record");
    startTime = new Date().getTime()
    readQuery = "select * from albums where id=1000"
    client.execute(readQuery, function(err , res) {
      console.log(res);
      endTime = new Date().getTime()
      console.log("Took " + (endTime-startTime) +" ms")
    })
  } else {
    writeAlbumData(start, end);
  }
};

const query = "CREATE TABLE if not exists albums (id int primary key, artist text, album_title text, tracks text, artist_description text, cover_art text, created_at timestamp, updated_at timestamp )"

client.execute(query, function(err, result) {
  if (err) {
    console.log(err);
  } else {
    console.log("table available!");
    generateData(start, end)
  }
})