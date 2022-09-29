const express = require('express')
const router = express.Router()
const { requireAuth } = require('../../utils/auth')
const { ReviewImage, Review } = require('../../db/models')

router.delete('/:reviewImageId', requireAuth, async (req, res, next) => {
    const { reviewImageId } = req.params
    const reviewImage = await ReviewImage.findByPk(reviewImageId)

    if (!reviewImage) {
        const err = new Error('Review image not found');
        err.title = 'Invalid review image ID';
        err.errors = ['There is not a review image associated with that review image ID'];
        err.status = 404;
        return next(err);
    }

    const review = await Review.findByPk(reviewImage.reviewId)

    if (review.userId !== req.user.id) {
        const err = new Error('User ID does not match author ID');
        err.title = 'Invalid author ID';
        err.errors = ['Only the review author can delete review images'];
        err.status = 401;
        return next(err);
    }

    try {
        await reviewImage.destroy()
        res.json('Review image successfully deleted')
    } catch (err) {
        next(err)
    }
})

module.exports = router
