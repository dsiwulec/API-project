'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Images', [
      {
        name: 'Spot 1',
        url: 'spot1.url'
      },
      {
        name: 'Spot 2',
        url: 'spot2.url'
      },
      {
        name: 'Spot 3',
        url: 'spot3.url'
      },
      {
        name: 'Spot 4',
        url: 'spot4.url'
      },
      {
        name: 'Spot 5',
        url: 'spot5.url'
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Images', {
      name: { [Op.in]: ['Spot 1', 'Spot 2', 'Spot 3', 'Spot 4', 'Spot 5'] }
    }, {});
  }
};
