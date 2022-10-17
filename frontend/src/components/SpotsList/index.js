import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getAllSpots } from "../../store/spots";
import './SpotsList.css'

const SpotsSplashPage = () => {
    const dispatch = useDispatch()
    const history = useHistory()

    const spots = useSelector(state => Object.values(state.spots.allSpots))

    useEffect(() => {
        dispatch(getAllSpots())
    }, [dispatch])

    return (
        <div id="spots-grid">
            {spots.map(spot => {
                return (
                    <div key={spot.id} onClick={() => history.push(`/spots/${spot.id}`)}>
                        <p>{spot.city}, {spot.state}</p>
                        <p>${spot.price} night</p>
                    </div>
                )
            })
            }
        </div>
    )
}

export default SpotsSplashPage
