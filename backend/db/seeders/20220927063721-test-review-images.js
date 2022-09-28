'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('ReviewImages', [
      {
        url: 'review1.url',
        reviewId: 1
      },
      {
        url: 'review2.url',
        reviewId: 2
      },
      {
        url: 'review3.url',
        reviewId: 3
      },
      {
        url: 'review4.url',
        reviewId: 4
      },
      {
        url: 'review5.url',
        reviewId: 5
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('ReviewImages', {
      name: { [Op.in]: ['Spot 1', 'Spot 2', 'Spot 3', 'Spot 4', 'Spot 5'] }
    }, {});
  }
};
