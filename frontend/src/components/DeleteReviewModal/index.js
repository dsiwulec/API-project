import React, { useState } from 'react';
import { Modal } from '../../context/Modal';
import DeleteReviewForm from './DeleteReviewForm';


function DeleteReviewModal() {
    const [showModal, setShowModal] = useState(false);

    const onClick = event => {
        event.stopPropagation()
        setShowModal(true)
    }

    return (
        <>
            <button id='delete' onClick={onClick}>Delete</button>
            {showModal && (
                <Modal onClose={() => setShowModal(false)}>
                    <DeleteReviewForm setShowModal={setShowModal} />
                </Modal>
            )}
        </>
    );
}

export default DeleteReviewModal;
