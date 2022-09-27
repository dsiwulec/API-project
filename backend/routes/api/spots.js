const express = require('express')
const sequelize = require('sequelize')
const { requireAuth } = require('../../utils/auth')
const { Spot, Review } = require('../../db/models')
const router = express.Router()

router.get('/', async (req, res) => {
    const spots = await Spot.findAll({
        raw: true
    })

    for (const spot of spots) {
        const spotReviews = await Review.findAll({
            where: {
                spotId: spot.id
            },
            raw: true,
            attributes: {
                include: [
                    [
                        sequelize.fn("AVG", sequelize.col("stars")),
                        "avgRating"
                    ]
                ]
            }
        })

        spot.avgRating = spotReviews[0].avgRating
    }

    return res.json(spots)
})

router.post('/', requireAuth, async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body
    const newSpot = await Spot.create({
        ownerId: req.user.id,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    })

    res.json(newSpot)
})

module.exports = router
