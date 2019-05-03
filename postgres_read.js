const { Pool } = require('pg');

process.env.PGHOST = "localhost";
process.env.PGDATABASE = "node_db";
process.env.PGUSER = "node_user";
process.env.PGPASSWORD = "node_123";


const pool = new Pool()

const query = "select * from albums where id = 10000000 limit 1";

startTime = (new Date()).getTime()
pool.query(query, function(err, res) {
  pool.end()
  endTime = (new Date()).getTime()
  console.log((endTime-startTime) + " ms");
});