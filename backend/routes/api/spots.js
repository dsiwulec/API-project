const express = require('express')
const sequelize = require('sequelize')
const { requireAuth } = require('../../utils/auth')
const { Spot, SpotImage, Review, User, ReviewImage, Booking } = require('../../db/models')
const { validateSpot, validateReview, validateBooking, validateQueryFilters, assignSearchFilters } = require('../../utils/validation')
const router = express.Router()


router.get('/', validateQueryFilters, async (req, res, next) => {
    let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query
    const where = {}
    const pagination = { subQuery: false }

    assignSearchFilters(pagination, where, page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice, next)

    const spots = await Spot.findAll({
        ...pagination,
        where,
        raw: true,
        order: ['id'],
        group: 'Spot.id',
        attributes: {
            include: [[sequelize.fn('ROUND', sequelize.fn("AVG", sequelize.col("stars")), 1), "avgRating"]]
        },
        include: {
            model: Review,
            attributes: []
        },
    })

    for (const spot of spots) {
        if (!spot.avgRating) spot.avgRating = 0.0
    }

    return res.json({
        Spots: spots,
        page,
        size
    })
})

router.post('/', validateSpot, requireAuth, async (req, res, next) => {
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

router.post('/:spotId/images', requireAuth, async (req, res, next) => {
    const { url, preview } = req.body
    const { spotId } = req.params
    const spot = await Spot.findByPk(spotId)

    if (!spot) {
        const err = new Error('Spot not found');
        err.title = 'Invalid spot ID';
        err.errors = ['There is not a spot associated with that spot ID'];
        err.status = 404;
        return next(err);
    }

    if (req.user.id !== spot.ownerId) throw new Error('Only the owner of a spot can add images')

    const newImage = await SpotImage.create({
        url,
        preview,
        spotId: spotId
    })

    if (spot.previewImage !== null) {
        const oldPreview = await SpotImage.findOne({
            where: {
                url: spot.previewImage,
                preview: true,
                spotId: spot.id
            }
        })

        await oldPreview.update({ preview: false })
    }
    //     const oldId = spot.previewImage
    //     const oldPreview = await SpotImage.findByPk(oldId)
    //     await oldPreview.update({ preview: false })
    // }

    await spot.update({ previewImage: newImage.url })

    res.json({
        id: newImage.id,
        url: newImage.url,
        preview: newImage.preview
    })
})

router.get('/current', requireAuth, async (req, res, next) => {
    const spots = await Spot.findAll({
        where: {
            ownerId: req.user.id
        },
        raw: true,
        group: 'Spot.id',
        attributes: {
            include: [[sequelize.fn('ROUND', sequelize.fn("AVG", sequelize.col("stars")), 1), "avgRating"]]
        },
        include: {
            model: Review,
            attributes: []
        },
    })

    for (const spot of spots) {
        if (!spot.avgRating) spot.avgRating = 0.0
    }

    return res.json({
        Spots: spots
    })
})

router.get('/:spotId', async (req, res, next) => {
    const { spotId } = req.params
    const spot = await Spot.findOne({
        where: {
            id: spotId
        },
        raw: true,
        group: 'Spot.id',
        attributes: {
            include: [
                [sequelize.fn('COUNT', sequelize.col('stars')), 'numReviews'],
                [sequelize.fn('ROUND', sequelize.fn('AVG', sequelize.col('stars')), 1), 'avgStarRating']
            ],
            exclude: ['previewImage']
        },
        include: {
            model: Review,
            attributes: []
        }
    })

    if (!spot) {
        const err = new Error('Spot not found');
        err.title = 'Invalid spot ID';
        err.errors = ['There is not a spot associated with that spot ID'];
        err.status = 404;
        return next(err);
    }

    if (!spot.avgStarRating) spot.avgStarRating = 0.0

    const spotImages = await SpotImage.findAll({
        where: {
            spotId
        },
        attributes: {
            exclude: ['spotId', 'createdAt', 'updatedAt']
        }
    })

    const spotOwner = await User.findOne({
        where: {
            id: spot.ownerId
        },
        attributes: {
            exclude: ['username']
        }
    })

    res.json({
        ...spot,
        SpotImages: spotImages,
        Owner: spotOwner
    })
})

router.put('/:spotId', requireAuth, validateSpot, async (req, res, next) => {
    const { spotId } = req.params
    const { address, city, state, country, lat, lng, name, descirption, price } = req.body
    const spot = await Spot.findOne({
        where: {
            id: spotId
        },
        attributes: {
            exclude: ['previewImage']
        }
    })

    if (!spot) {
        const err = new Error('Spot not found');
        err.title = 'Invalid spot ID';
        err.errors = ['There is not a spot associated with that spot ID'];
        err.status = 404;
        return next(err);
    }

    if (spot.ownerId !== req.user.id) {
        const err = new Error('User ID does not match owner ID');
        err.title = 'Invalid owner ID';
        err.errors = ['Only the spot owner can edit spot details'];
        err.status = 401;
        return next(err);
    }

    await spot.update({ address, city, state, country, lat, lng, name, descirption, price })

    res.json(spot)
})

router.post('/:spotId/reviews', requireAuth, validateReview, async (req, res, next) => {
    const { spotId } = req.params
    const { review, stars } = req.body
    const spot = await Spot.findByPk(spotId)
    const existingReview = await Review.findOne({
        where: {
            userId: req.user.id
        }
    })

    if (!spot) {
        const err = new Error('Spot not found');
        err.title = 'Invalid spot ID';
        err.errors = ['There is not a spot associated with that spot ID'];
        err.status = 404;
        return next(err);
    }

    if (existingReview) {
        const err = new Error('User already has a review for this spot')
        err.title = 'Review limit exceeded'
        err.errors = ['A review already exists for this spot from the current user']
        err.status = 403
        return next(err)
    }

    const newReview = await Review.create({
        userId: req.user.id,
        spotId,
        stars,
        review
    })

    res.json(newReview)
})

router.get('/:spotId/reviews', async (req, res, next) => {
    const { spotId } = req.params
    const spot = await Spot.findByPk(spotId)

    if (!spot) {
        const err = new Error('Spot not found');
        err.title = 'Invalid spot ID';
        err.errors = ['There is not a spot associated with that spot ID'];
        err.status = 404;
        return next(err);
    }

    const reviews = await Review.findAll({
        where: {
            spotId
        },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            }
        ]
    })

    res.json({
        Reviews: reviews
    })
})

router.post('/:spotId/bookings', requireAuth, validateBooking, async (req, res, next) => {
    const { spotId } = req.params
    const userId = req.user.id
    const { startDate, endDate } = req.body
    const spot = await Spot.findByPk(spotId)
    const existingBooking = await Booking.findOne({
        where: {
            spotId,
            startDate,
            endDate
        }
    })

    if (!spot) {
        const err = new Error('Spot not found');
        err.title = 'Invalid spot ID';
        err.errors = ['There is not a spot associated with that spot ID'];
        err.status = 404;
        return next(err);
    }

    if (existingBooking) {
        const err = new Error('Sorry, this spot is already booked for the specified dates');
        err.title = 'Invalid booking dates';
        err.errors = {
            "startDate": "Start date conflicts with an existing booking",
            "endDate": "End date conflicts with an existing booking"
        };
        err.status = 403;
        return next(err);
    }

    if (spot.ownerId === userId) {
        const err = new Error('User ID conflict');
        err.title = 'Invalid user ID';
        err.errors = ["The spot owner is unable to create bookings for spots they own"];
        err.status = 401;
        return next(err);
    }

    const newBooking = await Booking.create({
        spotId,
        userId,
        startDate,
        endDate
    })

    res.json(newBooking)
})

router.get('/:spotId/bookings', requireAuth, async (req, res, next) => {
    const { spotId } = req.params
    const userId = req.user.id
    const spot = await Spot.findByPk(spotId)

    if (!spot) {
        const err = new Error('Spot not found');
        err.title = 'Invalid spot ID';
        err.errors = ['There is not a spot associated with that spot ID'];
        err.status = 404;
        return next(err);
    }

    if (userId !== spot.ownerId) {
        const bookings = await Booking.findAll({
            where: {
                spotId
            },
            attributes: ['spotId', 'startDate', 'endDate']
        })

        return res.json({
            Bookings: bookings
        })
    } else {
        const bookings = await Booking.findAll({
            where: {
                spotId
            },
            include: [
                {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName']
                }
            ]
        })
        return res.json({
            Bookings: bookings
        })
    }
})

router.delete('/:spotId', requireAuth, async (req, res, next) => {
    const { spotId } = req.params
    const spot = await Spot.findByPk(spotId)

    if (!spot) {
        const err = new Error('Spot not found');
        err.title = 'Invalid spot ID';
        err.errors = ['There is not a spot associated with that spot ID'];
        err.status = 404;
        return next(err);
    }

    if (spot.ownerId !== req.user.id) {
        const err = new Error('User ID does not match owner ID');
        err.title = 'Invalid user ID';
        err.errors = ["User ID must match owner ID to delete a spot"];
        err.status = 401;
        return next(err);
    }

    try {
        await spot.destroy()
        res.json({
            message: 'Spot successfully deleted'
        })
    } catch (err) {
        next(err)
    }
})

module.exports = router
