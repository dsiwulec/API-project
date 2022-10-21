import React, { useState } from 'react';
import { Modal } from '../../context/Modal';
import CreateSpotForm from './CreateSpotForm';
import './CreateSpot.css'


function CreateSpotModal() {
    const [showModal, setShowModal] = useState(false);

    const onClick = event => {
        event.stopPropagation()
        setShowModal(true)
    }

    return (
        <>
            <button id="host" onClick={onClick}>Become a Host</button>
            {showModal && (
                <Modal onClose={() => setShowModal(false)}>
                    <CreateSpotForm setShowModal={setShowModal} />
                </Modal>
            )}
        </>
    );
}

export default CreateSpotModal;
