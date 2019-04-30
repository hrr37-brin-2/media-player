const { Pool } = require('pg');
const sql = require('sql');

process.env.PGHOST = "localhost";
process.env.PGDATABASE = "node_db";
process.env.PGUSER = "node_user";
process.env.PGPASSWORD = "node_123";

const pool = new Pool();

const getData = async (id, callback) => {
  const client = await pool.connect()
  const query = `select * from Albums where id=${id} limit 1`

  try {
    await client.query('BEGIN')
    const results = await client.query(query);
   results.rows[0].tracks = JSON.parse(results.rows[0].tracks)
    callback(results.rows[0])
  } catch(e) {
    console.error(e.message);
  } finally {
    client.release()
  }
}

const createAlbum = async (req, res) => {
  const {artist, album_title, tracks, artist_description   } = req.body;
  const client = await pool.connect()
  const query = `insert into Albums (artist, album_title, tracks, artist_description) values ( '${artist}', '${album_title}', '${JSON.stringify(tracks)}', '${artist_description}')`

  try {
    await client.query('BEGIN')
    await client.query(query);
    return res.status(201).json({
      success: true
    })
  } catch(e) {
    console.error(e.message);
  } finally {
    client.release()
  }


}

module.exports.getData = getData;
module.exports.createAlbum = createAlbum;
