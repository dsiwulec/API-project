import React, { useState } from 'react';
import { Modal } from '../../context/Modal';
import DeleteSpotForm from './DeleteSpotForm';
import './DeleteSpot.css'


function DeleteSpotModal() {
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
                    <DeleteSpotForm setShowModal={setShowModal} />
                </Modal>
            )}
        </>
    );
}

export default DeleteSpotModal;
