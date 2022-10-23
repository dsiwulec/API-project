import { csrfFetch } from "./csrf"

const CREATE_NEW_REVIEW = 'reviews/CREATE_NEW_SPOT'
const LOAD_SPOT_REVIEWS = 'reviews/LOAD_SPOT_REVIEWS'
const LOAD_USER_REVIEWS = 'reviews/LOAD_USER_REVIEWS'
const EDIT_REVIEW = 'reviews/EDIT_REVIEW'
const DELETE_REVIEW = 'reviews/DELETE_REVIEW'

const newReview = review => ({
    type: CREATE_NEW_REVIEW,
    review
})

const loadSpotReviews = reviews => ({
    type: LOAD_SPOT_REVIEWS,
    reviews
})

const loadUserReviews = reviews => ({
    type: LOAD_USER_REVIEWS,
    reviews
})

const editReviewDetails = editedReview => ({
    type: EDIT_REVIEW,
    editedReview
})

const deleteThisReview = reviewId => ({
    type: DELETE_REVIEW,
    reviewId
})

export const createNewReview = reviewData => async dispatch => {
    const response = await csrfFetch(`/api/spots/${reviewData.spotId}/reviews`, {
        method: 'POST',
        body: JSON.stringify(reviewData)
    })

    if (response.ok) {
        const review = await response.json()
        dispatch(newReview(review))

        return review
    }
}

export const getSpotReviews = spotId => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`);

    if (response.ok) {
        const reviews = await response.json();
        dispatch(loadSpotReviews(reviews));
    }

};

export const getUserReviews = () => async dispatch => {
    const response = await csrfFetch(`/api/reviews/current`)

    if (response.ok) {
        const reviews = await response.json()
        dispatch(loadUserReviews(reviews))
    }
}



export const editReview = newData => async dispatch => {
    const response = await csrfFetch(`/api/reviews/${newData.id}`, {
        method: 'PUT',
        body: JSON.stringify(newData)
    })

    if (response.ok) {
        const editedReview = await response.json()
        dispatch(editReviewDetails(editedReview))
        return editedReview
    }
}

export const deleteReview = reviewId => async dispatch => {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE'
    })

    if (response.ok) {
        dispatch(deleteThisReview(reviewId))
    }
}


const reviewsReducer = (state = { spot: {}, user: {} }, action) => {
    switch (action.type) {
        case CREATE_NEW_REVIEW:
            return {
                ...state,
                spot: { ...state.spot, [action.review.id]: action.review },
                user: { ...state.user, [action.review.id]: action.review }
            }

        case LOAD_SPOT_REVIEWS:
            state.spot = {}

            action.reviews.Reviews.forEach(review => {
                state.spot[review.id] = review
            })
            return { ...state }

        case LOAD_USER_REVIEWS:
            state.user = {}

            action.reviews.Reviews.forEach(review => {
                state.user[review.id] = review
            })
            return { ...state }

        case EDIT_REVIEW:
            return {
                ...state,
                spot: { ...state.reviews.spot, [action.reviews.editedReview.id]: action.reviews.editedReview },
                user: { ...state.reviews.user, [action.reviews.editedReview.id]: action.reviews.editedReview }
            }

        case DELETE_REVIEW:
            delete state.spot[action.reviewId]
            delete state.user[action.reviewId]
            return { spot: { ...state.spot }, user: { ...state.user } }

        default:
            return state;
    }
};

export default reviewsReducer;
