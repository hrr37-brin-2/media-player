const faker = require('faker');
const { Pool } = require('pg');
const sql = require('sql');
const trackData = require('./albumTracks');

process.env.PGHOST = "localhost";
process.env.PGDATABASE = "node_db";
process.env.PGUSER = "node_user";
process.env.PGPASSWORD = "node_123";

let Albums = sql.define({
  name: 'albums',
  columns: [
   'id',
   'artist',
   'album_title',
   'tracks',
   'artist_description'
  ]
});

let chunkSize = 1000;
let totalRecords = 10000000;
let rowsCount = 0;
let start = 1;
let end = chunkSize;

const pool = new Pool();

const writeRows = (rows) => {
  rowsCount += rows.length;
  let percentage = (rowsCount * 100) / totalRecords;
  console.log(`Generated records count ${rowsCount}. Progress - ${percentage} %`);
  let query = Albums.insert(rows).toQuery();
  (async () => {
    const client = await pool.connect()

    try {
      await client.query('BEGIN')
      await client.query(query)

      await client.query('COMMIT')
    } catch (e) {
      await client.query('ROLLBACK')
      throw e
    } finally {
      client.release()
      start = end + 1;
      end = start - 1 + chunkSize;
      generateData(start, end)
    }
  })().catch(e => console.error(e.stack))
};

const generateTracks = () =>{
  const tracks = []
  for (let i=0; i < trackData.length; i++){
    const track = {
      track: trackData[i].trackName,
      url: trackData[i].url,
      lyrics: trackData[i].lyrics
    }
    tracks.push(track)
  }
  return JSON.stringify(tracks);
};

function createIndex() {
	(async () => {
  const client = await pool.connect()
  let query = "CREATE index IF NOT EXISTS album_id_index on albums(id)";
  try {
    await client.query('BEGIN')
    await client.query(query)

    await client.query('COMMIT')
  } catch (e) {
    await client.query('ROLLBACK')
    throw e
  } finally {
    client.release()
    console.log("Index generated!")
  }
	})().catch(e => console.error(e.stack));
}

const writeAlbumData = (start, stop) => {
  let output = [];
  for (let j = start; j <= stop; j++) {
   // let id = j;
    let artist = faker.random.words(2);
    let album_title = faker.random.words(3);
    let tracks = generateTracks()
    let artist_description = faker.lorem.paragraph();
    output.push({
     // id,
      artist,
      album_title,
      tracks,
      artist_description
    })
  }
  writeRows(output)
};

const generateData = (start, end) => {
  if (start > totalRecords){
  createIndex();
  } else {
    writeAlbumData(start, end);
  }
};

(async () => {
  const client = await pool.connect()
  let query = "CREATE TABLE if not exists albums ( id serial primary key, artist text, album_title text, tracks text, artist_description text)"
  try {
    await client.query('BEGIN')
    await client.query(query)

    await client.query('COMMIT')
  } catch (e) {
    await client.query('ROLLBACK')
    throw e
  } finally {
    client.release()
    generateData(start, end)
  }
})().catch(e => console.error(e.stack));