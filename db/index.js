const { Pool } = require('pg');
const sql = require('sql');

process.env.PGHOST = "172.31.86.92";
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
    console.log("===data", results.rows)
    results.rows[0].tracks = JSON.parse(results.rows[0].tracks)
    callback(results.rows[0])
  } catch(e) {
    console.error(e.message);
  }
}

const createAlbum = async (req, res) => {
  const { album } = req.body;
  try {
    const existingAlbum = await Album.findOne({
      artist: album.artist,
      albumTitle: album.albumTitle
    })

    if (existingAlbum){
      return res.status(400).json({
        error: "Album Already exist"
      })
    }
    let newAlbum = new Album(album);
    newAlbum = await newAlbum.save()
    return res.status(201).json({album: newAlbum})
  }catch(e){
    return res.status(500).json({
      error: e.message
    })
  }
}

module.exports.getData = getData;
module.exports.createAlbum = createAlbum;