import { Link } from "react-router-dom";
import './SpotCard.css'

const SpotCard = ({ spot }) => {

    return (
        <Link to={`/spots/${spot.id}`}>
            <img className="preview-image" src={spot.previewImage} alt={spot.name} />
            <div id="card-header">
                <p id="card-left">{spot.city}, {spot.state}</p>
                <p id="card-right"><span className="star">&#9733;</span>{spot.avgRating}</p>
            </div>
            <p>${spot.price} <span className="night-text">night</span></p>
        </Link>
    )
}

export default SpotCard
