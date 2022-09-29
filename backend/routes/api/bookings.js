const express = require('express')
const router = express.Router()
const { Booking, Spot } = require('../../db/models')
const { requireAuth } = require('../../utils/auth')

router.get('/current', requireAuth, async (req, res, next) => {
    const userId = req.user.id
    const bookings = await Booking.findAll({
        where: {
            userId
        },
        include: [
            {
                model: Spot,
                attributes: {
                    exclude: ['description', 'createdAt', 'updatedAt']
                }
            }
        ]
    })

    res.json(bookings)
})

module.exports = router
