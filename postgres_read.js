const { Pool, Client } = require('pg');

process.env.PGHOST = "localhost";
process.env.PGDATABASE = "node_db";
process.env.PGUSER = "node_user";
process.env.PGPASSWORD = "node_123";

const pool = new Pool()
query = "select * from albums where id = 10000000"
pool.query(query, function(err, res) {
  console.log(res.rows[0])
  pool.end()
});