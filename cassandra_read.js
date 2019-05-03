const cassandra = require('cassandra-driver');

let client = new cassandra.Client({
  contactPoints: ['localhost'],
  localDataCenter: 'datacenter1',
  keyspace: 'sdc_kaz',
  });


query = "select * from albums where id=10000000"

startTime = (new Date()).getTime()
client.execute(query, function(err, result) {
  console.log(result.first())
  if (err) {
    console.log(err);
  } else {
    endTime = (new Date()).getTime()
    console.log((endTime-startTime) + " ms")
  }
})