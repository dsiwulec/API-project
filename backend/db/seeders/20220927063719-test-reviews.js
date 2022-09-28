'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Reviews', [
      {
        userId: 2,
        spotId: 1,
        stars: 4,
        review: 'Beautiful apartment, but not the best location.'
      },
      {
        userId: 2,
        spotId: 2,
        stars: 4,
        review: 'A little cramped.'
      },
      {
        userId: 4,
        spotId: 3,
        stars: 5,
        review: 'Everything was absolutely perfect!'
      },
      {
        userId: 4,
        spotId: 4,
        stars: 5,
        review: 'Beautiful building with amazing views!'
      },
      {
        userId: 5,
        spotId: 5,
        stars: 5,
        review: 'I would definitely come here again.'
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Reviews', {
      userId: { [Op.in]: [2, 4, 5] }
    }, {});
  }
};
