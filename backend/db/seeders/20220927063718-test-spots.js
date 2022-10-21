'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Spots', [
      {
        ownerId: 1,
        address: '2109 Broadway',
        city: 'Banner Elk',
        state: 'North Carolina',
        country: 'United States',
        lat: 40.7128,
        lng: 74.0060,
        name: 'The Flying Eagle in EN - Best views in High Country- hot tub, pool table',
        description: `Welcome to The Flying Eagle, the pinnacle in luxury homes! With its awe-inspiring glass walls, The Flying Eagle is a home like no other.
        Perched at the top of Eagles Nest, you'll have stunning views of the Elk River Valley as well as views towards Tennessee. The main floor has the living
        room, dining for ten, and gourmet kitchen. The kitchen has a large granite island, wine cooler, and large range to cook for the entire group. There is an
        indoor table for ten, and beautiful bar stools for five. In the living room, you'll find a gas fireplace and a large smart TV with YouTube TV for live viewing.`,
        price: 1152,
        previewImage: "https://a0.muscache.com/im/pictures/prohost-api/Hosting-41079700/original/fd8a0d30-848b-4efe-b5f3-b3a7042d7794.jpeg?im_w=960"
      },
      {
        ownerId: 1,
        address: '90 Bedford St',
        city: 'Blowing Rock',
        state: 'North Carolina',
        country: 'United States',
        lat: 40.7128,
        lng: 74.0060,
        name: 'Mountain Vistas at Eagles Nest - Sunset VIEWS! Hot tub! Game room! EV Charger!',
        description: `Welcome to the beautiful Mountain Vistas at Eagles Nest! This beautifully modern mountain home welcomes you to kick back and relax.
        Step outside and enjoy the cool mountain air at over 4,000' elevation! Rocking chairs make it a great place to relax. As its name suggests, the
        views are lovely from Mountain Vistas. Enjoy the brand new hot tub and watch the ever changing mountain vistas beyond, including both sunset and
        sunrise views! There is a great selection of seating on the lower deck as well, specifically chosen so that the railing won't obstruct your view.
        Have fun roasting marshmallows by the new firepit outside too! And by the parking area, you'll also find a 240V EV charger.`,
        price: 605,
        previewImage: "https://a0.muscache.com/im/pictures/prohost-api/Hosting-53311841/original/3901c322-b4cd-4057-b609-e163b9c97d45.jpeg?im_w=960"
      },
      {
        ownerId: 1,
        address: '66 Perry Street',
        city: 'Beech Mountain',
        state: 'North Carolina',
        country: 'United States',
        lat: 40.7128,
        lng: 74.0060,
        name: 'Majestic View Hideaway at Eagles Nest - NEW HOME! 50mi views, hot tub, game room',
        description: `BOOK EARLY AND BE ONE OF THE FIRST TO EXPERIENCE MAJESTIC VIEW HIDEAWAY AT EAGLES NEST!!
        Majestic View Hideaway, coming in 2021, will be a spectacular getaway! Besides easy access to everything Eagles Nest offers, guests of this beautiful brand new home will enjoy:
        3 levels with 4master bedroom suites - a total of 5 bedrooms, 4 full bathrooms, and 2 half bathrooms`,
        price: 851,
        previewImage: "https://a0.muscache.com/im/pictures/prohost-api/Hosting-47055143/original/c6c135e2-0949-4f0b-b2e8-d3688694b294.jpeg?im_w=960"
      },
      {
        ownerId: 3,
        address: '169 E 71st St',
        city: 'Bloomsburg',
        state: 'Pennsylvania',
        country: 'United States',
        lat: 40.7128,
        lng: 74.0060,
        name: 'Modern firetower chalet with majestic views',
        description: `If you want to wake up to amazing views, beautiful countryside, and 70 acres of private countryside, come to the Firetower Chalet.
        Guests love this chalet for the breathtaking views, miles of hiking trails, comfortable master bedroom, and fully stocked kitchen. The Chalet is
        3 minutes from the exciting town of Bloomsburg, and only 10-15 minutes from the #1 family amusement park in the country, Knoebels. This Chalet has
        amazing views to help you make amazing memories.`,
        price: 279,
        previewImage: "https://a0.muscache.com/im/pictures/20330f34-e6ae-4bed-b848-a86fc5020436.jpg?im_w=960"
      },
      {
        ownerId: 3,
        address: '36 Fuller Place',
        city: 'Leonardtown',
        state: 'Maryland',
        country: 'United States',
        lat: 40.7128,
        lng: 74.0060,
        name: 'Waterfront✦Private Dock✦Incredible Views &Sunsets✦',
        description: `Our dreamy waterfront getaway is the perfect spot to enjoy some rest and relaxation. Located directly on the waterfront of Breton Bay our
        home offers a scenic deck, screened in porch and private dock, that all feature breathtaking views that just can't be beat! Recently renovated, our 3
        bedroom 1 bath home sleeps up to six guests. Our location offers serene privacy, but still within 10 minutes of Leonardtown restaurants and shops. AC,
        High speed WiFi, and cable are all included in your stay.`,
        price: 232,
        previewImage: "https://a0.muscache.com/im/pictures/db2c233c-49bc-4a5a-9061-afa8b1bb33cb.jpg?im_w=960"
      },
      {
        ownerId: 3,
        address: '127 88th Street',
        city: 'Ocean City',
        state: 'Maryland',
        country: 'United States',
        lat: 40.7128,
        lng: 74.0060,
        name: 'Ocean Front Sea Terrace 209 ✦Heated Pool✦',
        description: `Enjoy your morning coffee on your private ocean front balcony or from the comfort of living room couch. Our ocean front retreat is an end
        unit (next to stairway- skip elevator lines) with ocean views including large heated pool and tennis court. Conveniently located 88th Street within walking
        distance of many OC's favorites.`,
        price: 187,
        previewImage: "https://a0.muscache.com/im/pictures/97c4c7ce-3ded-445e-b2f8-9ded10ae5be0.jpg?im_w=960"
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
