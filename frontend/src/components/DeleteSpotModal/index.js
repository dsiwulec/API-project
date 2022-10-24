import React from 'react';
import { Modal } from '../../context/Modal';
import DeleteSpotForm from './DeleteSpotForm';
import './DeleteSpot.css'


function DeleteSpotModal({ deleteSpot, setDeleteSpot }) {
    return (
        <>
            {deleteSpot && (
                <Modal onClose={() => setDeleteSpot(false)}>
                    <DeleteSpotForm setShowModal={setDeleteSpot} />
                </Modal>
            )}
        </>
    );
}

export default DeleteSpotModal;
