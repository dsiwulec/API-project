import { csrfFetch } from "./csrf"

const CREATE_NEW_SPOT = 'spots/CREATE_NEW_SPOT'
const LOAD_SPOTS = 'spots/LOAD_SPOTS'
const LOAD_SPOT_DETAILS = 'spots/LOAD_SPOT_DETAILS'
const UPDATE_SPOT = 'spots/UPDATE_SPOT'
const DELETE_SPOT = 'spots/DELETE_SPOT'


const loadSpots = spots => ({
    type: LOAD_SPOTS,
    spots
})

const loadSpotDetails = spot => ({
    type: LOAD_SPOT_DETAILS,
    spot
})

export const getAllSpots = () => async dispatch => {
    const response = await csrfFetch(`/api/spots`);

    if (response.ok) {
        const spots = await response.json();
        dispatch(loadSpots(spots));
    }

};

export const getOneSpot = (spotId) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}`)

    if (response.ok) {
        const spot = await response.json()
        dispatch(loadSpotDetails(spot))
    }

}

export const actionCreateNewSpot = spotDetails => ({
    type: CREATE_NEW_SPOT,
    spotDetails
})


const spotsReducer = (state = { allSpots: {}, spotDetails: {} }, action) => {
    switch (action.type) {
        case LOAD_SPOTS:
            console.log('ACTION SPOTS', action.spots.Spots)
            action.spots.Spots.forEach(spot => {
                state.allSpots[spot.id] = spot
            })
            return { ...state }
        case LOAD_SPOT_DETAILS:
            return { ...state, spotDetails: { ...action.spot } }
        default:
            return state
    }
}

export default spotsReducer
