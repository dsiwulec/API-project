import { csrfFetch } from "./csrf"

const CREATE_NEW_SPOT = 'spots/CREATE_NEW_SPOT'
const LOAD_SPOTS = 'spots/LOAD_SPOTS'
const LOAD_SPOT_DETAILS = 'spots/LOAD_SPOT_DETAILS'
const EDIT_SPOT_DETAILS = 'spots/EDIT_SPOT_DETAILS'
const DELETE_SPOT = 'spots/DELETE_SPOT'


const loadSpots = spots => ({
    type: LOAD_SPOTS,
    spots
})

const loadSpotDetails = spot => ({
    type: LOAD_SPOT_DETAILS,
    spot
})

const newSpot = spotData => ({
    type: CREATE_NEW_SPOT,
    spotData
})

const editSpotDetails = editedSpot => ({
    type: EDIT_SPOT_DETAILS,
    editedSpot
})

const deleteThisSpot = spotId => ({
    type: DELETE_SPOT,
    spotId
})

export const getAllSpots = () => async dispatch => {
    const response = await csrfFetch(`/api/spots`);

    if (response.ok) {
        const spots = await response.json();
        dispatch(loadSpots(spots));
    }

};

export const getOneSpot = spotId => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}`)

    if (response.ok) {
        const spot = await response.json()
        dispatch(loadSpotDetails(spot))
    }
}

export const createNewSpot = (spotData, image) => async dispatch => {
    const response = await csrfFetch('/api/spots', {
        method: 'POST',
        body: JSON.stringify(spotData)
    })

    if (response.ok) {
        const spot = await response.json()
        const res = await csrfFetch(`/api/spots/${spot.id}/images`, {
            method: 'POST',
            body: JSON.stringify(image)
        })

        if (res.ok) {
            const image = await res.json()
            spot.previewImage = image.url
            dispatch(newSpot(spot))
        }

        return spot
    }
}

export const editSpot = newData => async dispatch => {
    const response = await csrfFetch(`/api/spots/${newData.id}`, {
        method: 'PUT',
        body: JSON.stringify(newData)
    })

    if (response.ok) {
        const editedSpot = await response.json()
        dispatch(editSpotDetails(editedSpot))
        return editedSpot
    }
}

export const deleteSpot = spotId => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'DELETE'
    })

    if (response) {
        dispatch(deleteThisSpot(spotId))
    }
}

const spotsReducer = (state = { allSpots: {}, spotDetails: {} }, action) => {
    switch (action.type) {
        case LOAD_SPOTS:
            action.spots.Spots.forEach(spot => {
                state.allSpots[spot.id] = spot
            })
            return { ...state }

        case LOAD_SPOT_DETAILS:
            return { ...state, spotDetails: { ...action.spot } }

        case CREATE_NEW_SPOT:
            return { ...state, allSpots: { ...state.allSpots, [action.spotData.id]: action.spotData }, spotDetails: {} }

        case EDIT_SPOT_DETAILS:
            return {
                ...state,
                allSpots: { ...state.allSpots, [action.editedSpot.id]: action.editedSpot },
                spotDetails: { ...state.spotDetails, ...action.editedSpot }
            }

        case DELETE_SPOT:
            delete state.allSpots[action.spotId]
            return { ...state }

        default:
            return state
    }
}

export default spotsReducer
