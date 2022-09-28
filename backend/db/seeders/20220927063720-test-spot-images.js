'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('SpotImages', [
      {
        url: 'spot1.url',
        preview: true,
        spotId: 1
      },
      {
        url: 'spot2.url',
        preview: true,
        spotId: 2
      },
      {
        url: 'spot3.url',
        preview: true,
        spotId: 3
      },
      {
        url: 'spot4.url',
        preview: true,
        spotId: 4
      },
      {
        url: 'spot5.url',
        preview: true,
        spotId: 5
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('SpotImages', {
      url: { [Op.in]: ['spot1.url', 'spot2.url', 'spot3.url', 'spot4.url', 'spot5.url'] }
    }, {});
  }
};
