'use strict';
module.exports = (sequelize, DataTypes) => {
  const Album = sequelize.define('Album', {
    artist: {
      type: DataTypes.STRING,
      allowNull: false
    },
    albumTitle: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tracks: {
      type: DataTypes.TEXT,
      get: function(){
        return JSON.parse(this.getDataValue('tracks'));
      },
      set: function(value){
        return this.setDataValue('tracks', JSON.stringify(value));
      },
      allowNull: false,
    },
    artistDescription: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    coverArt: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {});
  Album.associate = function(models) {
    // associations can be defined here
  };
  sequelize.sync()
  return Album;
};

