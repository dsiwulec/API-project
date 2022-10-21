import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createNewReview } from "../../store/reviews";
import StarRating from "../StarRating";

function CreateReviewForm({ setShowModal }) {
    const dispatch = useDispatch();
    const spotId = useSelector(state => state.spots.spotDetails.id)
    const [review, setReview] = useState("")
    const [stars, setStars] = useState(0)
    const [errors, setErrors] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);

        const reviewData = {
            spotId,
            stars,
            review
        }

        const newReview = await dispatch(createNewReview(reviewData))
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(data.errors)
            });

        setShowModal(false)
        return newReview
    }

    return (
        <form onSubmit={handleSubmit}>
            {errors.length > 0 && <ul>
                {errors.map((error, idx) => <li key={idx}>{error}</li>)}
            </ul>}
            <h2 className="header-text">How was your stay?</h2>
            <StarRating stars={stars} setStars={setStars} />
            <textarea
                placeholder="Review"
                type="text"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                required
            ></textarea>
            <div id="button-container">
                <button className="edit-form-buttons" type="submit">Submit Review</button>
                <button className="edit-form-buttons" type="button" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
        </form>
    );
}

export default CreateReviewForm;
