import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getOneSpot } from "../../store/spots";

const SpotDetailsPage = () => {
    const dispatch = useDispatch()
    const { spotId } = useParams()

    const spotDetails = useSelector(state => state.spots.spotDetails)

    useEffect(() => {
        dispatch(getOneSpot(spotId))
    }, [dispatch])

    return (
        <div>
            <p>Hello</p>
        </div>
    )
}

export default SpotDetailsPage
