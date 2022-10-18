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
        previewImage: "https://a0.muscache.com/im/pictures/ec242181-817a-4cca-88f7-97c79e44196e.jpg?im_w=720"
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
        previewImage: "https://a0.muscache.com/im/pictures/miso/Hosting-578897320179146437/original/037b4837-ac41-43a6-8c08-8d97c606fe6d.jpeg?im_w=720"
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
        previewImage: "https://a0.muscache.com/im/pictures/f767e642-217f-4db8-bcf0-51896b062139.jpg?im_w=720"
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
        previewImage: "https://a0.muscache.com/im/pictures/prohost-api/Hosting-53311841/original/3901c322-b4cd-4057-b609-e163b9c97d45.jpeg?im_w=720"
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
        previewImage: "https://a0.muscache.com/im/pictures/prohost-api/Hosting-47055143/original/c6c135e2-0949-4f0b-b2e8-d3688694b294.jpeg?im_w=720"
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
