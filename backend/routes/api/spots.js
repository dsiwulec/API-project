const express = require('express')
const sequelize = require('sequelize')
const { requireAuth } = require('../../utils/auth')
const { Spot, SpotImage, Review, User, ReviewImage } = require('../../db/models')
const router = express.Router()
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

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

router.get('/', async (req, res) => {
    const spots = await Spot.findAll({
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

    return res.json(spots)
})

router.post('/', validateSpot, requireAuth, async (req, res) => {
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

router.post('/:spotId/images', requireAuth, async (req, res) => {
    const { url, preview } = req.body
    const { spotId } = req.params
    const spot = await Spot.findByPk(spotId)

    if (!spot) {
        res.status(404)
        return res.json('Spot not found')
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

router.get('/current', requireAuth, async (req, res) => {
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

    return res.json(spots)
})

router.get('/:spotId', async (req, res) => {
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
        res.status(404)
        return res.json('No spot with that ID found')
    }

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

router.put('/:spotId', requireAuth, validateSpot, async (req, res) => {
    const { spotId } = req.params
    const { address, city, state, country, lat, lng, name, descirption, price } = req.body
    const spot = await Spot.findByPk(spotId)

    if (!spot) {
        res.status(404)
        return res.json('No spot with that ID found')
    }

    if (spot.ownerId !== req.user.id) throw new Error('Only the spot owner can edit spot details')


    await spot.update({ address, city, state, country, lat, lng, name, descirption, price })

    res.json(spot)
})

router.post('/:spotId/reviews', requireAuth, validateReview, async (req, res) => {
    const { spotId } = req.params
    const { review, stars } = req.body
    const spot = await Spot.findByPk(spotId)
    const existingReview = await Review.findOne({
        where: {
            userId: req.user.id
        }
    })

    if (!spot) {
        res.status(404)
        return res.json('No spot with that ID found')
    }

    if (existingReview) {
        res.status(403)
        return res.json('A review already exists for the spot from the current user')
    }

    const newReview = await Review.create({
        userId: req.user.id,
        spotId,
        stars,
        review
    })

    res.json(newReview)
})

router.get('/:spotId/reviews', async (req, res) => {
    const { spotId } = req.params
    const spot = await Spot.findByPk(spotId)

    if (!spot) {
        res.status(404)
        return res.json('No spot with that ID found')
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

module.exports = router
