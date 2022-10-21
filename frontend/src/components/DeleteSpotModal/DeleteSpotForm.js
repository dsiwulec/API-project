import React, { useState } from "react";
import { useHistory } from 'react-router-dom'
import { deleteSpot } from '../../store/spots'
import { useDispatch, useSelector } from "react-redux";
import './DeleteSpot.css'


function DeleteForm({ setShowModal }) {
    const dispatch = useDispatch();
    const history = useHistory()
    const spot = useSelector(state => state.spots.spotDetails)
    const [errors, setErrors] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors([]);
        dispatch(deleteSpot(spot.id))

        history.push('/')
    };

    return (
        <form onSubmit={handleSubmit}>
            {errors.length > 0 && <ul>
                {errors.map((error, idx) => (
                    <li key={idx}>{error}</li>
                ))}
            </ul>}
            <h2>We're sorry to see you go...</h2>
            <h4>This action is irreversable, do you want to continue?</h4>
            <div id="button-container">
                <button className="delete-form-buttons" type="submit">Delete</button>
                <button className="delete-form-buttons" type="button" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
        </form>
    );
}

export default DeleteForm;
