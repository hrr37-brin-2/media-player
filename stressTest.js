const faker = require('faker');

function generateRandomID (userContext, events, done) {
  const id = faker.random.number(9000000);
  userContext.vars.id = id;
  return done();
}


function generateRandomData (userContext, events, done) {
  // generate data with Faker:
  const artist =  faker.lorem.words(2);
  const album_title =  faker.lorem.words(2);
  const tracks =    [{ track:"one",   url:
  'https://s3.amazonaws.com/sdcsongtracks/AUGUSTUS+PABLO+JAVA++LIVE+1986.mp3',
 lyrics:
  'Eaque quia id nemo. Iste et qui totam. Sequi et consequatur quo doloribus. Quae voluptatum id dolores ab fugiat ratione sunt velit.' },
{ track:"two",   url:
  'https://s3.amazonaws.com/sdcsongtracks/Brown+Paper+Bag+-+Roni+Size++Reprazent.mp3',
 lyrics:
  'Fuga ab fugit. Rerum eius veniam hic reprehenderit quod hic. Pariatur et natus et omnis.' }];

  const artist_description =  faker.lorem.paragraph();

  // add variables to virtual user's context:
  userContext.vars.artist = artist;
  userContext.vars.album_title = album_title;
  userContext.vars.tracks = tracks;
  userContext.vars.artist_description = artist_description;
  //userContext.vars.id = id;

  // continue with executing the scenario:
  return done();
}

module.exports = {
  generateRandomData,
  generateRandomID
};