'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Bookings', [
      {
        spotId: 1,
        userId: 3,
        startDate: '2022-12-30',
        endDate: '2023-01-02'
      },
      {
        spotId: 2,
        userId: 2,
        startDate: '2022-12-30',
        endDate: '2023-01-02'
      },
      {
        spotId: 3,
        userId: 5,
        startDate: '2022-12-30',
        endDate: '2023-01-02'
      },
      {
        spotId: 4,
        userId: 4,
        startDate: '2022-12-30',
        endDate: '2023-01-02'
      },
      {
        spotId: 5,
        userId: 1,
        startDate: '2022-12-30',
        endDate: '2023-01-02'
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Bookings', {
      userId: { [Op.in]: [2, 4, 5] }
    }, {});
  }
};
