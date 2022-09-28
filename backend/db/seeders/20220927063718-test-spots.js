'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Spots', [
      {
        ownerId: 1,
        address: '2109 Broadway',
        city: 'New York',
        state: 'New York',
        country: 'USA',
        lat: 40.7128,
        lng: 74.0060,
        name: 'Apartment in New York',
        description: 'Spacious apartment perfect for your stay!',
        price: 125,
      },
      {
        ownerId: 1,
        address: '90 Bedford St',
        city: 'New York',
        state: 'New York',
        country: 'USA',
        lat: 40.7128,
        lng: 74.0060,
        name: 'Private room in New York',
        description: 'All the amenities and comforts of home, great for long or short stays!',
        price: 100,
      },
      {
        ownerId: 1,
        address: '66 Perry Street',
        city: 'New York',
        state: 'New York',
        country: 'USA',
        lat: 40.7128,
        lng: 74.0060,
        name: 'Serviced apartment in New York',
        description: 'Listed by Tripadvisor as one of the top 25 hotels in the United States!',
        price: 155,
      },
      {
        ownerId: 3,
        address: '169 E 71st St',
        city: 'New York',
        state: 'New York',
        country: 'USA',
        lat: 40.7128,
        lng: 74.0060,
        name: 'Boutique hotel in New York',
        description: 'Welcome to citizenM Bowery, the tallest building on the oldest street in NYC!',
        price: 175,
      },
      {
        ownerId: 3,
        address: '36 Fuller Place',
        city: 'New York',
        state: 'New York',
        country: 'USA',
        lat: 40.7128,
        lng: 74.0060,
        name: 'Hotel room in New York',
        description: 'Oversized rooms with modern amenities.',
        price: 150,
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Spots', {
      ownderId: { [Op.in]: [1, 3] }
    }, {});
  }
};
