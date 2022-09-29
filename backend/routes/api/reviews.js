const express = require('express')
const router = express.Router()
const { requireAuth } = require('../../utils/auth')
const { Review, ReviewImage, Spot, User } = require('../../db/models')
const { restoreUser } = require('../../utils/auth')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateReview = [
    check('review')
        .exists({ checkFalsy: true })
        .withMessage('The review text cannot be empty.'),
    check('stars')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a valid rating from 1-5.'),
    handleValidationErrors
];

router.post('/:reviewId/images', requireAuth, async (req, res, next) => {
    const { url } = req.body
    const { reviewId } = req.params
    const review = await Review.findByPk(reviewId)
    const reviewImages = await ReviewImage.findAll({
        where: {
            reviewId
        }
    })

    if (reviewImages.length > 10) {
        const err = new Error('Reviews can have a maximum of 10 pictures')
        err.title = 'Review image limit exceeded'
        err.errors = ['The current review has already reached the maximum allowed number of images']
        err.status = 400
        return next(err)
    }

    if (!review) {
        const err = new Error('Review not found');
        err.title = 'Invalid review ID';
        err.errors = ['There is not a review associated with that review ID'];
        err.status = 404;
        return next(err);
    }

    if (req.user.id !== review.userId) {
        const err = new Error('Current user is not the author of the review');
        err.title = 'Invalid user ID';
        err.errors = ['Only the author of the review can add images to the review'];
        err.status = 401
        return next(err);
    }

    const newImage = await ReviewImage.create({
        url,
        reviewId
    })

    return res.json({
        id: newImage.id,
        url: newImage.url
    })
})

router.get('/current', requireAuth, async (req, res, next) => {
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

router.put('/:reviewId', requireAuth, validateReview, async (req, res, next) => {
    const { reviewId } = req.params
    const { review, stars } = req.body
    const user = req.user.id
    const selectedReview = await Review.findByPk(reviewId)

    if (!selectedReview) {
        const err = new Error('Review not found');
        err.title = 'Invalid review ID';
        err.errors = ['There is not a review associated with that review ID'];
        err.status = 404;
        return next(err);
    }

    if (selectedReview.userId !== user) {
        const err = new Error('Current user is not the author of the review');
        err.title = 'Invalid user ID';
        err.errors = ['Only the author of the review can edit the review'];
        err.status = 401
        return next(err);
    }

    await selectedReview.update({
        review,
        stars
    })

    res.json(selectedReview)
})

module.exports = router
