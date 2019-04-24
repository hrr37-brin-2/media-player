'use strict';
const generateData = require('../../helper')
module.exports = {
  up: (queryInterface) => {
    const albums = generateData()
    return queryInterface.bulkInsert('Albums', albums, {});
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('Albums', null, {});
  }
};