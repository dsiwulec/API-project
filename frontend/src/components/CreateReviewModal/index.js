import React from 'react';
import { Modal } from '../../context/Modal';
import CreateReviewForm from './CreateReviewForm';


function CreateReviewModal({ createReview, setCreateReview }) {
    return (
        <>
            {createReview && (
                <Modal onClose={() => setCreateReview(false)}>
                    <CreateReviewForm setShowModal={setCreateReview} />
                </Modal>
            )}
        </>
    );
}

export default CreateReviewModal;
