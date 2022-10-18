import { Link } from "react-router-dom";
import './SpotCard.css'

const SpotCard = ({ spot }) => {

    return (
        <Link to={`/spots/${spot.id}`}>
            <img className="preview-image" src={spot.previewImage} alt={spot.name} />
            <p>{spot.city}, {spot.state}</p>
            <p>${spot.price} night</p>
        </Link>
    )
}

export default SpotCard
