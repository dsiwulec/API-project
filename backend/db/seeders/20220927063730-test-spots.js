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
        previewImage: 1
      },
      {
        ownerId: 1,
        address: '2109 Broadway',
        city: 'New York',
        state: 'New York',
        country: 'USA',
        lat: 40.7128,
        lng: 74.0060,
        name: 'Apartment in New York',
        description: 'All the amenities and comforts of home, great for long or short stays!',
        price: 125,
        previewImage: 1
      },
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
        previewImage: 1
      },
      {
        ownerId: 2,
        address: '2109 Broadway',
        city: 'New York',
        state: 'New York',
        country: 'USA',
        lat: 40.7128,
        lng: 74.0060,
        name: 'Apartment in New York',
        description: 'Spacious apartment perfect for your stay!',
        price: 125,
        previewImage: 1
      },
      {
        ownerId: 3,
        address: '2109 Broadway',
        city: 'New York',
        state: 'New York',
        country: 'USA',
        lat: 40.7128,
        lng: 74.0060,
        name: 'Apartment in New York',
        description: 'Spacious apartment perfect for your stay!',
        price: 125,
        previewImage: 1
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Users', {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
    }, {});
  }
};
