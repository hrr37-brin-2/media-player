const { Pool, Client } = require('pg');
const path = require ('path');

require('dotenv')
  .config({ path: path.join(__dirname, '..', '..', '.env')});

const pool = new Pool()
query = "select * from albums where id = 10000000"
pool.query(query, function(err, res) {
  pool.end()
});