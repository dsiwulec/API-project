import React from 'react';
import { Modal } from '../../context/Modal';
import LoginForm from './LoginForm';

function LoginFormModal({ userLogin, setUserLogin }) {

    return (
        <>
            {userLogin && (
                <Modal onClose={() => setUserLogin(false)}>
                    <LoginForm setShowModal={setUserLogin} />
                </Modal>
            )}
        </>
    );
}

export default LoginFormModal;
