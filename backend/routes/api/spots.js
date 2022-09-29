const express = require('express')
const sequelize = require('sequelize')
const { Op, where } = require("sequelize")
const { requireAuth } = require('../../utils/auth')
const { Spot, SpotImage, Review, User, ReviewImage, Booking } = require('../../db/models')
const router = express.Router()
const { check } = require('express-validator')
const { handleValidationErrors } = require('../../utils/validation')

const validateSpot = [
    check('address')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a valid address.'),
    check('city')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a valid city.'),
    check('state')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a valid state.'),
    check('country')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a valid country.'),
    check('lat')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a valid latitude.'),
    check('lng')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a valid longitude.'),
    check('name')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a valid name.'),
    check('description')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a valid description.'),
    check('price')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a valid price.'),
    handleValidationErrors
];

const validateReview = [
    check('review')
        .exists({ checkFalsy: true })
        .withMessage('The review text cannot be empty.'),
    check('stars')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a valid rating from 1-5.'),
    handleValidationErrors
];

const validateQueryFilters = (pagination, where, page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice, next) => {
    if (page && size) {
        if (page >= 1 && size >= 1) {
            pagination.limit = size
            pagination.offset = size * (page - 1)
        } else {
            const err = new Error('Please enter valid values for page and size');
            err.title = 'Invalid page and/or size value';
            err.errors = ['Page and size values must be greater than 0'];
            err.status = 400;
            next(err);
            return true;
        }
    }

    if (minLat) {
        if (minLat > -90 && minLat < 90) {
            where.lat = { [Op.gte]: minLat }
        } else {
            const err = new Error('Please enter a valid value for minLat');
            err.title = 'Invalid minLat value';
            err.errors = ['The minLat value must be between -90 and 90'];
            err.status = 400;
            next(err);
            return true;
        }
    }

    if (maxLat) {
        if (maxLat > -90 && maxLat < 90) {
            where.lat = { [Op.lte]: maxLat }
        } else {
            const err = new Error('Please enter a valid value for maxLat');
            err.title = 'Invalid maxLat value';
            err.errors = ['The maxLat value must be between -90 and 90'];
            err.status = 400;
            next(err);
            return true;
        }
    }

    if (minLng) {
        if (minLng > -180 && minLng < 180) {
            where.lng = { [Op.gte]: minLng }
        } else {
            const err = new Error('Please enter a valid value for minLng');
            err.title = 'Invalid minLng value';
            err.errors = ['The minLng value must be between -180 and 180'];
            err.status = 400;
            next(err);
            return true;
        }
    }

    if (maxLng) {
        if (maxLng > -180 && maxLng < 180) {
            where.lng = { [Op.lte]: maxLng }
        } else {
            const err = new Error('Please enter a valid value for maxLng');
            err.title = 'Invalid maxLng value';
            err.errors = ['The maxLng value must be between -180 and 180'];
            err.status = 400;
            next(err);
            return true;
        }
    }

    if (minPrice) {
        if (minPrice > 0) {
            where.price = { [Op.gte]: minPrice }
        } else {
            const err = new Error('Please enter a valid value for minPrice');
            err.title = 'Invalid minPrice value';
            err.errors = ['The minPrice value must be greater than 0'];
            err.status = 400;
            next(err);
            return true;
        }
    }

    if (maxPrice) {
        if (maxPrice > 0) {
            where.price = { [Op.lte]: maxPrice }
        } else {
            const err = new Error('Please enter a valid value for maxPrice');
            err.title = 'Invalid maxPrice value';
            err.errors = ['The maxPrice value must be greater than 0'];
            err.status = 400;
            next(err);
            return true;
        }
    }
}

router.get('/', async (req, res, next) => {
    let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query
    const where = {}
    const pagination = { limit: 3, subQuery: false }

    const filterResults = validateQueryFilters(pagination, where, page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice, next)

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

    if (!filterResults) {
        return res.json({
            spots,
            page,
            size
        })
    }
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
        const oldId = spot.previewImage
        const oldPreview = await SpotImage.findByPk(oldId)
        await oldPreview.update({ preview: false })
    }

    await spot.update({ previewImage: newImage.id })

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

    return res.json(spots)
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
                [sequelize.fn('ROUND', sequelize.fn('AVG', sequelize.col('stars')), 1), 'avgRating']
            ]
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

    if (!spot.avgRating) spot.avgRating = 0.0

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
        spot,
        spotImages,
        spotOwner
    })
})

router.put('/:spotId', requireAuth, validateSpot, async (req, res, next) => {
    const { spotId } = req.params
    const { address, city, state, country, lat, lng, name, descirption, price } = req.body
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
        const err = new Error('Users can only submit one review per spot')
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

    res.json(reviews)
})

router.post('/:spotId/bookings', requireAuth, async (req, res, next) => {
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
        const err = new Error('Start and end date conflict');
        err.title = 'Invalid booking dates';
        err.errors = ["The selected start and end dates overlap with another booking at the selected spot"];
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

        return res.json(bookings)
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
        return res.json(bookings)
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
