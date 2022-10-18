import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getAllSpots } from "../../store/spots";
import SpotCard from "../SpotCard";
import './SpotsList.css'

const SpotsSplashPage = () => {
    const dispatch = useDispatch()

    const spots = useSelector(state => Object.values(state.spots.allSpots))

    useEffect(() => {
        dispatch(getAllSpots())
    }, [dispatch])

    return (
        <div id="spots-browser">
            <div id="spots-grid">
                {spots.map(spot => {
                    return (
                        <SpotCard key={spot.id} spot={spot} />
                    )
                })
                }
            </div>
        </div>
    )
}

export default SpotsSplashPage
