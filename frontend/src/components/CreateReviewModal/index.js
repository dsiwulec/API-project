import React, { useState } from 'react';
import { Modal } from '../../context/Modal';
import CreateReviewForm from './CreateReviewForm';


function CreateReviewModal() {
    const [showModal, setShowModal] = useState(false);

    const onClick = event => {
        event.stopPropagation()
        setShowModal(true)
    }

    return (
        <>
            <button onClick={onClick}>Leave a Review</button>
            {showModal && (
                <Modal onClose={() => setShowModal(false)}>
                    <CreateReviewForm setShowModal={setShowModal} />
                </Modal>
            )}
        </>
    );
}

export default CreateReviewModal;
