import DeleteReviewModal from '../DeleteReviewModal'
import { useSelector } from 'react-redux'
import './ReviewCard.css'

const ReviewCard = ({ review }) => {
    const month = new Intl.DateTimeFormat('en-US', { month: "long" }).format(new Date(review.createdAt))
    const year = new Date(review.createdAt).getFullYear()

    const user = useSelector(state => state.session.user)

    return (
        <div className='review-card'>
            <div className="review-card-header">
                <i className="fa-solid fa-circle-user" />
                <div className="review-info">
                    {review.User && <div className="review-info-top">
                        <p>{review.User.firstName}</p>
                        {user.id === review.User.id && <DeleteReviewModal />}
                    </div>}
                    <p className='date'>{month} {year}</p>
                </div>
            </div>
            <div className='review-body'>{review.review}</div>
        </div>
    )
}

export default ReviewCard
