'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Reviews', [
      {
        userId: 2,
        spotId: 1,
        stars: 5,
        review: `Very secluded and special place to stay. Amazing place and property making you feel that you are
        all by yourself in the middle of the mountains but yet in 5 to 10 minutes eating at a great restaurant
        or local eatery. Very well taken care of and a perfect place to recharge yourself.`
      },
      {
        userId: 3,
        spotId: 1,
        stars: 5,
        review: `LOVELY LOVELY LOVELY!!!!!!The view from the balcony or the bed is amazing.TONS of things to do on
        site.Just beautiful!This is a must stay location.We got summer time scenery that was gorgeous but I can only
        imagine what fall or winter would look like.You should definitely stay here.`
      },
      {
        userId: 4,
        spotId: 1,
        stars: 4,
        review: `We had a wonderful stay at the Fire Tower. If it is available definitely book your stay! The view is
        amazing and so private! We saw some deer had a fire and listened to all the sounds of nature. Coffee on the
        upstairs deck. So relaxing We cannnot wait to come back!`
      },
      {
        userId: 5,
        spotId: 1,
        stars: 5,
        review: `Amazing! I truly do not know where to start. The VIEW! The space, the land were all well above our
        expectations! We were lucky enough to get a last minute reservation that did not disappoint! Great place for
        a family get away to disconnect from the city for a while. If this is available you book!`
      },
      {
        userId: 2,
        spotId: 2,
        stars: 5,
        review: `This place is an absolute gem. If you find this available and do not snap it up you are out of your mind.
        It is quiet and secluded without being remote. It is just as clean as the pics and has everything you need for a getaway.
        That being said if you have a four wheel drive vehicle, bring it. :) they will let you borrow the work truck if you do not.
        We are definitely going to go back again.`
      },
      {
        userId: 3,
        spotId: 2,
        stars: 5,
        review: `This was our second stay, though the first was over five years ago in the winter. Both seasons were beautiful and unique,
        and the house has everything you need to be comfortable. We loved star gazing from the deck, truly unbeatable views, and loved all
        the wildlife that came to visit. Lovely, peaceful place.`
      },
      {
        userId: 4,
        spotId: 2,
        stars: 4,
        review: `This cabin is beautiful, and so are the views - but all of the lovely touches, the wonderful communication from our host,
        all the little extras that made it so comfortable and lovely…it was the perfect place for a small girls weekend away and we loved it!`
      },
      {
        userId: 5,
        spotId: 2,
        stars: 5,
        review: `Absolutely stunning! Secluded but a quick drive into town. 10/10 would recommend!`
      },
      {
        userId: 2,
        spotId: 3,
        stars: 5,
        review: `This place is special. It offers seclusion (while still being just a few minutes from town) and total tranquility. If you enjoy
        nature and quiet, this is the place for you. We enjoyed the hike around the fire tower. The inside is lovely and modern, but has the rustic
        charm of wood all around. Just beautiful. And, if we forgot to bring something, they probably already had it. If they don't, there's plenty
        of stores within a 10 minute drive. I would highly recommend this place.`
      },
      {
        userId: 3,
        spotId: 3,
        stars: 5,
        review: 'Perfect for a couples get away. Very relaxing. We would definitely recommend this place to all of our friends.'
      },
      {
        userId: 4,
        spotId: 3,
        stars: 5,
        review: `Host was very hospitable,friendly and very attentive. The place was neat and everything you could need in the settling was available
        and met. The scenery was beautiful and the place just as. Look forward to visiting again.`
      },
      {
        userId: 5,
        spotId: 3,
        stars: 5,
        review: 'Great place to stay and getaway from everything.'
      },
      {
        userId: 1,
        spotId: 4,
        stars: 5,
        review: 'Great location and awesome fire tower cabin! We would definitely stay here again. Loved the firepit and how private yet still close to town this is.'
      },

      {
        userId: 2,
        spotId: 4,
        stars: 5,
        review: `The Firetower is everything described and more. This is a fabulous place to relax and unwind, yet just a short drive to activities, stores and restaurants.
        The accommodations are very cozy and comfortable and we cannot wait to book our next stay!`
      },

      {
        userId: 4,
        spotId: 4,
        stars: 5,
        review: `Magical firetower with all the modern amenities that you need. The firetowers design is magnificent and the sunset views are incredible. Comfortable, cozy,
        and feels just like home in your own private woods. A must for any couple looking to getaway.`
      },

      {
        userId: 5,
        spotId: 4,
        stars: 5,
        review: 'The firetower is just as described. The views are breathtaking and the amenities and location are perfect to relax and unplug for a few days. We look forward to returning!'
      },
      {
        userId: 1,
        spotId: 5,
        stars: 4,
        review: `What an incredible location! Amazing sunsets, peaceful quiet sirroundings, great shops and restaurants in town. The house is very clean,
        so cute, and instantly comfortable. We ate every meal on the screened in porch. Spent sunsets on the dock. Everything available if you need to cook,
        comfortable beds, awesome shower, kayaks were great. Great communication and response time. Highly recommend!`
      },
      {
        userId: 2,
        spotId: 5,
        stars: 5,
        review: `Lovely location on the water and beautiful house. Spectacular sunsets and wonderful view from the living room and screened-in porch. The host was
        very helpful giving us information to find the house. We loved our stay!`
      },
      {
        userId: 4,
        spotId: 5,
        stars: 5,
        review: `What a jewel of a house. Such a lovely spot. Very few places on earth where you can watch the sunrise and sunset. This is one of them. The house is
        charming, the location is beautiful, and Jake is an outstanding host. I highly recommend his place!`
      },
      {
        userId: 5,
        spotId: 5,
        stars: 5,
        review: `Loved the sunset and watching the weather move across the bay. The big screened-in porch and the dock were just delightful. The house is lovely, with
        plenty of room for six. We hope to be back soon!`
      },
      {
        userId: 1,
        spotId: 6,
        stars: 5,
        review: 'Close to the beach. Beautifully remodeled. Great host communication. Interaction with other people staying in Sea Terrace was very pleasant.'
      },
      {
        userId: 2,
        spotId: 6,
        stars: 5,
        review: 'Great location with modern and comfortable accommodations. Wonderful place to stay for a weekend away in OC!'
      },
      {
        userId: 4,
        spotId: 6,
        stars: 5,
        review: `Wonderful unit, clean and decorated so nicely. Felt like home from the minute we arrived. Great location and nice secure building. Have stayed in many
        places in OC and this was by far the best place ever! We will defiantly book again.`
      },
      {
        userId: 5,
        spotId: 6,
        stars: 5,
        review: `Great place! Pool was awesome, the beach is close and the view from the porch was nice! Comfy place for a family or a few friends. The host was great
         and kept us up to date with anything we needed to know. Will be back :)`
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
