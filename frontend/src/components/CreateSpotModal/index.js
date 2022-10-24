import React from 'react';
import { Modal } from '../../context/Modal';
import CreateSpotForm from './CreateSpotForm';
import './CreateSpot.css'


function CreateSpotModal({ create, setCreate }) {

    return (
        <>

            {create && (
                <Modal onClose={() => setCreate(false)}>
                    <CreateSpotForm setShowModal={setCreate} />
                </Modal>
            )}
        </>
    );
}

export default CreateSpotModal;
