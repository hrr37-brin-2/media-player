var express = require ('express');
var path = require ('path');
var DIST_DIR = path.join(__dirname, '../client/dist');
var db = require ('../db/index')
var bodyParser =require ('body-parser');
var cors = require ('cors');

var app = express();

app.use(cors());

app.use(express.static(DIST_DIR))
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())


app.get('/media/:id', (req,res) =>{
  var id = req.params.id;

  db.getData(id, (data) => {

    res.json(data)
  })
})
app.post('/media', db.createAlbum);

// app.put('/media/:id', db.updateAlbum);

// app.delete('/media/:id', db.deleteAlbum);

app.get('/*', (req, res) => {
  res.sendFile(DIST_DIR + "/index.html")
})

var port = 3002;

app.listen(port, '0.0.0.0', ()=> {
  console.log(`Listening to port ${port}`)
})
