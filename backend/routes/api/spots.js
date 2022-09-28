const express = require('express')
const sequelize = require('sequelize')
const { requireAuth } = require('../../utils/auth')
const { Spot, SpotImage, Review } = require('../../db/models')
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

module.exports = router
