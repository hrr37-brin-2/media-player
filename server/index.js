require('newrelic');
const express = require ('express');
const path = require ('path');
const DIST_DIR = path.join(__dirname, '../client/dist');
const db = require ('../db/index')
const bodyParser =require ('body-parser');
const cors = require ('cors');

const app = express();

app.use(cors());

app.use(express.static(DIST_DIR))
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())


app.get('/media/:id', (req,res) =>{
  let id = req.params.id;
  db.getData(id, (data) => {
    res.json(data)
  })
})

app.post('/media', db.createAlbum);

// app.put('/media/:id', db.updateAlbum);

// app.delete('/media/:id', db.deleteAlbum);

app.get('*', (req, res) => {
  res.sendFile(DIST_DIR + "/index.html")
})

const port = process.env.PORT || 3002;

app.listen(port, '0.0.0.0', ()=> {
  console.log(`Listening to port ${port}`)
})
