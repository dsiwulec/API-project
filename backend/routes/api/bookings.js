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

router.put('/:bookingId', requireAuth, async (req, res, next) => {
    const date = new Date()
    const currentDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    const { bookingId } = req.params
    const { startDate, endDate } = req.body

    const booking = await Booking.findByPk(bookingId)

    if (!booking) {
        const err = new Error('Booking not found');
        err.title = 'Invalid booking ID';
        err.errors = ['There is not a booking associated with that booking ID'];
        err.status = 404;
        return next(err);
    }

    const existingBooking = await Booking.findOne({
        where: {
            spotId: booking.spotId,
            startDate,
            endDate
        }
    })

    if (booking.userId !== req.user.id) {
        const err = new Error('User ID and booking user Id do not match');
        err.title = 'Invalid user ID';
        err.errors = ['Only the user who created the booking can edit that booking'];
        err.status = 401;
        return next(err);
    }

    if (existingBooking) {
        const err = new Error('Start and end date conflict');
        err.title = 'Invalid booking dates';
        err.errors = ["The selected start and end dates overlap with another booking at the selected spot"];
        err.status = 403;
        return next(err);
    }

    if (endDate < currentDate) {
        const err = new Error('Booking has expired');
        err.title = 'Invalid booking';
        err.errors = ["Bookings can't be edited after the end date"];
        err.status = 400;
        return next(err);
    }

    await booking.update({
        startDate,
        endDate
    })

    res.json(booking)
})

router.delete('/:bookingId', requireAuth, async (req, res, next) => {
    const { bookingId } = req.params
    const date = new Date()
    const currentDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    const booking = await Booking.findByPk(bookingId)

    if (!booking) {
        const err = new Error('Booking not found');
        err.title = 'Invalid booking ID';
        err.errors = ['There is not a booking associated with that booking ID'];
        err.status = 404;
        return next(err);
    }

    const spot = await Spot.findByPk(booking.spotId)

    if (booking.startDate < currentDate) {
        const err = new Error('Booking start date has passed');
        err.title = 'Invalid delete request';
        err.errors = ["Bookings can't be be deleted after the assoicated start date has passed"];
        err.status = 400;
        return next(err);
    }

    if (booking.userId === req.user.id || spot.ownerId === req.user.id) {
        try {
            await booking.destroy()
            res.json('Booking successfully deleted')
        } catch (err) {
            next(err)
        }
    } else {
        const err = new Error('User ID does not match owner ID or user booking ID');
        err.title = 'Invalid user ID';
        err.errors = ['Only the booking user or spot owner can delete a reservation'];
        err.status = 401;
        return next(err);
    }
})

module.exports = router
