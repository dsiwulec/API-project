import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editSpot } from '../../store/spots'

function EditSpotForm({ setShowModal }) {
    const dispatch = useDispatch();
    const spot = useSelector(state => state.spots.spotDetails)
    const [address, setAddress] = useState(spot.address)
    const [city, setCity] = useState(spot.city)
    const [state, setState] = useState(spot.state);
    const [country, setCountry] = useState(spot.country);
    const [name, setName] = useState(spot.name)
    const [description, setDescription] = useState(spot.description)
    const [price, setPrice] = useState(spot.price)
    const [errors, setErrors] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);

        const newData = {
            id: spot.id,
            address,
            city,
            state,
            country,
            name,
            description,
            price
        }

        const editedSpot = await dispatch(editSpot(newData))
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(data.errors)
            });

        if (editedSpot) setShowModal(false)
    }

    return (
        <form onSubmit={handleSubmit}>
            {errors.length > 0 && <ul>
                {errors.map((error, idx) => <li key={idx}>{error}</li>)}
            </ul>}
            <h2 className="header-text">Edit Spot Details</h2>
            <input
                className="create-spot"
                placeholder="Address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
            />
            <input
                className="create-spot"
                placeholder="City"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
            />
            <input
                className="create-spot"
                placeholder="State"
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
            />
            <input
                className="create-spot"
                placeholder="Country"
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
            />
            <input
                className="create-spot"
                placeholder="Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <input
                className="create-spot"
                placeholder="Price"
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
            />
            <textarea
                placeholder="Description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
            ></textarea>
            <div id="button-container">
                <button className="edit-form-buttons" type="submit">Submit Changes</button>
                <button className="edit-form-buttons" type="button" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
        </form>
    );
}

export default EditSpotForm;
