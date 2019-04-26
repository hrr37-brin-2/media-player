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
    console.log("===data", results.rows)
    results.rows[0].tracks = JSON.parse(results.rows[0].tracks)
    callback(results.rows[0])
  } catch(e) {
    console.error(e.message);
  }
}

module.exports.getData = getData;