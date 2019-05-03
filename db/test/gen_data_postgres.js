const faker = require('faker');
const { Pool } = require('pg');
const sql = require('sql');

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
   'artist_description',
   'coverart',
   'created_at',
   'updated_at'
  ]
});

let chunkSize = 150;
let totalRecords = 1000;
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
  for (let i=1; i <= 10; i++){
    const track = {
      track: faker.random.words(4),
      url: faker.image.imageUrl(),
      lyrics: faker.lorem.paragraph()
    }
    tracks.push(track)

  }
  return JSON.stringify(tracks);
}

function createIndex() {
	(async () => {
	  const client = await pool.connect()
	  let query = "CREATE index album_id_index on albums(id)";
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
    let id = j;
    let artist = faker.random.words();
    let album_title = faker.random.words();
    let tracks = generateTracks()
    let artist_description = faker.lorem.paragraph();
    let coverart = faker.image.imageUrl();
    output.push({
      id,
      artist,
      album_title,
      tracks,
      artist_description,
      coverart,
      created_at: new Date(),
      updated_at: new Date()
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
  let query = "CREATE TABLE if not exists albums ( id bigint, artist text, album_title text, tracks text, artist_description text, coverart text, created_at timestamp, updated_at timestamp )"
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