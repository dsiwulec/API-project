import React from 'react';
import { Modal } from '../../context/Modal';
import SignupForm from './SignupForm';

function SignupFormModal({ userSignup, setUserSignup }) {

    return (
        <>
            {userSignup && (
                <Modal onClose={() => setUserSignup(false)}>
                    <SignupForm />
                </Modal>
            )}
        </>
    );
}

export default SignupFormModal;
