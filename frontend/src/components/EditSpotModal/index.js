import React, { useState } from 'react';
import { Modal } from '../../context/Modal';
import EditSpotForm from './EditSpotForm';
import './EditSpot.css'


function EditSpotModal() {
    const [showModal, setShowModal] = useState(false);

    const onClick = event => {
        event.stopPropagation()
        setShowModal(true)
    }

    return (
        <>
            <button onClick={onClick}>Edit</button>
            {showModal && (
                <Modal onClose={() => setShowModal(false)}>
                    <EditSpotForm setShowModal={setShowModal} />
                </Modal>
            )}
        </>
    );
}

export default EditSpotModal;
