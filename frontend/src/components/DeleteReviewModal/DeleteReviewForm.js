import React, { useState } from "react";
import { deleteReview } from '../../store/reviews'
import { useDispatch, useSelector } from "react-redux";


function DeleteReviewForm({ setShowModal }) {
    const dispatch = useDispatch();
    const user = useSelector(state => state.session.user)
    const spotReviews = useSelector(state => Object.values(state.reviews.spot))
    const review = spotReviews.find(review => review.userId === user.id)
    const [errors, setErrors] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors([]);
        dispatch(deleteReview(review.id))
    };

    return (
        <form onSubmit={handleSubmit}>
            {errors.length > 0 && <ul>
                {errors.map((error, idx) => (
                    <li key={idx}>{error}</li>
                ))}
            </ul>}
            <h2>Your feedback is important to us...</h2>
            <h4>This action is irreversable, do you want to continue?</h4>
            <div id="button-container">
                <button className="delete-form-buttons" type="submit">Delete</button>
                <button className="delete-form-buttons" type="button" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
        </form>
    );
}

export default DeleteReviewForm;
