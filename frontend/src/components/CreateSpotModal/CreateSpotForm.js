import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { createNewSpot } from '../../store/spots'

function CreateSpotForm({ setShowModal }) {
    const dispatch = useDispatch();
    const history = useHistory()
    const [address, setAddress] = useState("")
    const [city, setCity] = useState("")
    const [state, setState] = useState("");
    const [country, setCountry] = useState("");
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [previewUrl, setPreviewUrl] = useState("")
    const [characterCount, setCharacterCount] = useState(0)
    const [errors, setErrors] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);

        const spotData = {
            address,
            city,
            state,
            country,
            name,
            description,
            price
        }

        const image = {
            url: previewUrl,
            preview: true
        }

        const spot = await dispatch(createNewSpot(spotData, image))
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(data.errors)
            });

        if (spot) {
            setShowModal(false)
            history.push(`/spots/${spot.id}`)
            return spot
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            {errors.length > 0 && <ul>
                {errors.map((error, idx) => <li key={idx}>{error}</li>)}
            </ul>}
            <h2 className="header-text">Become an AirNomad Host</h2>
            <div className="input-group">
                <input
                    className="create-spot"
                    placeholder="Address"
                    type="text"
                    value={address}
                    onChange={(e) => {
                        setAddress(e.target.value)
                        setCharacterCount(e.target.value.length)
                    }}
                    required
                    maxLength={50}
                    onFocus={(e) => setCharacterCount(e.target.value.length)}
                />
                <div className="character-count">{characterCount}/50</div>
            </div>
            <div className="input-group">
                <input
                    className="create-spot"
                    placeholder="City"
                    type="text"
                    value={city}
                    onChange={(e) => {
                        setCity(e.target.value)
                        setCharacterCount(e.target.value.length)
                    }}
                    required
                    maxLength={50}
                    onFocus={(e) => setCharacterCount(e.target.value.length)}
                />
                <div className="character-count">{characterCount}/50</div>
            </div>
            <div className="input-group">
                <input
                    className="create-spot"
                    placeholder="State"
                    type="text"
                    value={state}
                    onChange={(e) => {
                        setState(e.target.value)
                        setCharacterCount(e.target.value.length)
                    }}
                    required
                    maxLength={50}
                    onFocus={(e) => setCharacterCount(e.target.value.length)}
                />
                <div className="character-count">{characterCount}/50</div>
            </div>
            <div className="input-group">
                <input
                    className="create-spot"
                    placeholder="Country"
                    type="text"
                    value={country}
                    onChange={(e) => {
                        setCountry(e.target.value)
                        setCharacterCount(e.target.value.length)
                    }}
                    required
                    maxLength={50}
                    onFocus={(e) => setCharacterCount(e.target.value.length)}
                />
                <div className="character-count">{characterCount}/50</div>
            </div>
            <div className="input-group">
                <input
                    className="create-spot"
                    placeholder="Name"
                    type="text"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value)
                        setCharacterCount(e.target.value.length)
                    }}
                    required
                    maxLength={100}
                    onFocus={(e) => setCharacterCount(e.target.value.length)}
                />
                <div className="character-count">{characterCount}/100</div>
            </div>
            <input
                id="price"
                className="create-spot"
                placeholder="Price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                min={1}
                max={10000}
            />
            <div className="input-group">
                <input
                    id="preview-image"
                    className="create-spot"
                    placeholder="Preview Image URL"
                    type="url"
                    value={previewUrl}
                    onChange={(e) => {
                        setPreviewUrl(e.target.value)
                        setCharacterCount(e.target.value.length)
                    }}
                    required
                    maxLength={255}
                    onFocus={(e) => setCharacterCount(e.target.value.length)}
                />
                <div className="under-url">
                    <button className="demo-url" type="button" onClick={() => setPreviewUrl("https://a0.muscache.com/im/pictures/d7e9ec73-f907-493d-83ed-1d89ad92fb5e.jpg?im_w=1200")}>Demo URL</button>
                    <div className="character-count">{characterCount}/255</div>
                </div>
            </div>
            <div className="input-group">
                <textarea
                    placeholder="Description"
                    type="text"
                    value={description}
                    onChange={(e) => {
                        setDescription(e.target.value)
                        setCharacterCount(e.target.value.length)
                    }}
                    required
                    maxLength={1000}
                    onFocus={(e) => setCharacterCount(e.target.value.length)}
                ></textarea>
                <div className="character-count">{characterCount}/1000</div>
            </div>
            <button id="signup-button" type="submit">Start Hosting</button>
        </form>
    );
}

export default CreateSpotForm;
