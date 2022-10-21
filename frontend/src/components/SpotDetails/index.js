import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getOneSpot } from "../../store/spots";
import { getSpotReviews } from "../../store/reviews"
import EditSpotModal from "../EditSpotModal";
import DeleteSpotModal from "../DeleteSpotModal";
import ReviewCard from "../ReviewCard";
import CreateReviewModal from "../CreateReviewModal";
import './SpotDetails.css'

const SpotDetailsPage = () => {
    const dispatch = useDispatch()
    const { spotId } = useParams()
    const [previewImage, setPreviewImage] = useState(false)

    const sessionUser = useSelector(state => state.session.user);
    const spotDetails = useSelector(state => state.spots.spotDetails)
    const spotReviews = useSelector(state => Object.values(state.reviews.spot))
    const userReviewsForSpot = useSelector(state => state.reviews.user)

    useEffect(() => {
        dispatch(getOneSpot(spotId))
    }, [dispatch, spotId, userReviewsForSpot])

    useEffect(() => {
        dispatch(getSpotReviews(spotId))
    }, [dispatch, spotId, userReviewsForSpot])

    useEffect(() => {
        if (spotDetails.SpotImages) {
            setPreviewImage(spotDetails.SpotImages.find(image => image.preview === true))
        }
    }, [spotDetails.SpotImages])

    return (
        <div className="details-page">
            <h2>{spotDetails.name}</h2>
            <div className="overview">
                <div id="left-overview">
                    <p>&#9733;{spotDetails.avgStarRating} · <a id="reviews-link" href="#review_section">{spotDetails.numReviews} reviews</a> · {spotDetails.city}, {spotDetails.state}, {spotDetails.country}</p>
                </div>
                {sessionUser && spotDetails.Owner && sessionUser.id === spotDetails.Owner.id && (
                    <div>
                        <EditSpotModal />
                        <DeleteSpotModal />
                    </div>
                )}
            </div>
            {previewImage && spotDetails.SpotImages && spotDetails.SpotImages.length === 1 && <img id="only-preview" src={previewImage.url} alt="" />}
            {previewImage && spotDetails.SpotImages && spotDetails.SpotImages.length > 1 && <div className="spot-images">
                <div id="gallery-container">
                    <img id="spot-details-preview" src={previewImage.url} alt="" />
                    <div id="picture-gallery">
                        {spotDetails.SpotImages && spotDetails.SpotImages.map(image => {
                            if (image.preview === true) return null
                            return (
                                <img key={image.id} src={image.url} alt="" />
                            )
                        })}
                    </div>
                </div>
            </div>}

            <div>
                <div className="description-header">
                    {spotDetails.Owner && <h2>Hosted by {spotDetails.Owner.firstName}</h2>}
                    {spotDetails && <h2>${spotDetails.price} <span className="night">night</span></h2>}
                </div>
                {spotDetails && <p id="spot-description">{spotDetails.description}</p>}
            </div>
            <div id="review_section">
                <div className="review-section-header">
                    <div id="review-header-left">
                        {spotDetails && <h3>&#9733;{spotDetails.avgStarRating} · {spotDetails.numReviews} reviews</h3>}
                    </div>
                    {sessionUser && spotDetails && spotDetails.Owner && sessionUser.id !== spotDetails.Owner.id && <CreateReviewModal />}
                </div>
                <div className="reviews">
                    {spotReviews.map(review => (<ReviewCard key={review.id} review={review} />))}
                </div>
            </div>
        </div>
    )
}

export default SpotDetailsPage
