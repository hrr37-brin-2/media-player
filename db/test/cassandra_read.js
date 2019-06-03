const cassandra = require('cassandra-driver');
const path = require ('path');

require('dotenv')
  .config({ path: path.join(__dirname, '..', '..', '.env')});


let client = new cassandra.Client({
  contactPoints: [process.env.CASSANDRA_HOST],
  localDataCenter: process.env.CASSANDRA_DATA_CENTER,
  keyspace: process.env.CASSANDRA_KEYSPACE,
});

query = "select * from albums where id=10000000 limit 1"

startTime = (new Date()).getTime()
client.execute(query, function(err, result) {
  console.log(result.first());
  if (err) {
    console.log(err);
  } else {
    endTime = (new Date()).getTime()
    console.log((endTime-startTime) + " ms");
  }
})