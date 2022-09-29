const express = require('express')
const router = express.Router()
const { requireAuth } = require('../../utils/auth')
const { SpotImage, Spot } = require('../../db/models')

router.delete('/:spotImageId', requireAuth, async (req, res, next) => {
    const { spotImageId } = req.params
    const spotImage = await SpotImage.findByPk(spotImageId)

    if (!spotImage) {
        const err = new Error('Spot image not found');
        err.title = 'Invalid spot image ID';
        err.errors = ['There is not a spot image associated with that spot image ID'];
        err.status = 404;
        return next(err);
    }

    const spot = await Spot.findByPk(spotImage.spotId)

    if (spot.ownerId !== req.user.id) {
        const err = new Error('User ID does not match owner ID');
        err.title = 'Invalid owner ID';
        err.errors = ['Only the spot owner can delete spot images'];
        err.status = 401;
        return next(err);
    }

    try {
        await spotImage.destroy()
        res.json({
            message: 'Spot image successfully deleted'
        })
    } catch (err) {
        next(err)
    }
})

module.exports = router
