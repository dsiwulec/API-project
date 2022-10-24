import React from 'react';
import { Modal } from '../../context/Modal';
import DeleteReviewForm from './DeleteReviewForm';


function DeleteReviewModal({ deleteReview, setDeleteReview }) {
    return (
        <>
            {deleteReview && (
                <Modal onClose={() => setDeleteReview(false)}>
                    <DeleteReviewForm setShowModal={setDeleteReview} />
                </Modal>
            )}
        </>
    );
}

export default DeleteReviewModal;
