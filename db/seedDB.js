const path = require ('path');

require('dotenv')
  .config({ path: path.join(__dirname, '..', '.env')});

const db = require ('./index');
db.seedDB();