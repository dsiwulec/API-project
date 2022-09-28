const express = require('express')
const router = express.Router()
const { requireAuth } = require('../../utils/auth')
const { Review, ReviewImage, Spot, User } = require('../../db/models')
const { restoreUser } = require('../../utils/auth')

router.post('/:reviewId/images', requireAuth, async (req, res) => {
    const { url } = req.body
    const { reviewId } = req.params
    const review = await Review.findByPk(reviewId)
    const reviewImages = await ReviewImage.findAll({
        where: {
            reviewId
        }
    })

    if (reviewImages.length > 10) {
        restoreUser.status(400)
        return res.json('The maximum number of images has been reached')
    }

    if (!review) {
        res.status(404)
        return res.json('Review not found')
    }

    if (req.user.id !== review.userId) throw new Error('Only the author of the review can add images')

    const newImage = await ReviewImage.create({
        url,
        reviewId
    })

    return res.json({
        id: newImage.id,
        url: newImage.url
    })
})

router.get('/current', requireAuth, async (req, res) => {
    const userId = req.user.id
    const reviews = await Review.findAll({
        where: { userId },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: Spot,
                attributes: {
                    exclude: ['description', 'createdAt', 'updatedAt']
                }
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
