import React from 'react';
import { Modal } from '../../context/Modal';
import EditSpotForm from './EditSpotForm';
import './EditSpot.css'


function EditSpotModal({ edit, setEdit }) {
    return (
        <>
            {edit && (
                <Modal onClose={() => setEdit(false)}>
                    <EditSpotForm setShowModal={setEdit} />
                </Modal>
            )}
        </>
    );
}

export default EditSpotModal;
