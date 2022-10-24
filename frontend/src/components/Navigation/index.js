import React from 'react';
import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { login } from '../../store/session';
import ProfileButton from './ProfileButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import CreateSpotModal from '../CreateSpotModal';
import './Navigation.css';

function Navigation({ isLoaded }) {
    const dispatch = useDispatch()
    const sessionUser = useSelector(state => state.session.user);
    const [showMenu, setShowMenu] = useState(false)
    const [userSignup, setUserSignup] = useState(false)
    const [userLogin, setUserLogin] = useState(false)
    const [create, setCreate] = useState(false)

    const demoLogin = () => dispatch(login({ credential: 'demo', password: 'password' }))

    let sessionLinks;
    if (sessionUser) {
        sessionLinks = (
            <ProfileButton user={sessionUser} />
        );
    } else {
        sessionLinks = (
            <>
                <button onClick={() => {
                    setUserLogin(true)
                }}>Login</button>
                <button onClick={() => {
                    setUserSignup(true)
                }}>Sign Up</button>
                <button onClick={demoLogin}>Login as Demo User</button>
            </>
        );
    }

    useEffect(() => {
        if (showMenu === false) return;

        const closeMenu = (event) => {
            if (event.target.closest('#modal-content') === null) setShowMenu(false);
        };

        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener('click', closeMenu);
    }, [showMenu]);

    return (
        <div className='nav-bar'>
            <NavLink exact to="/" >
                <div id="home-logo">
                    <i className="fa-brands fa-airbnb"></i>
                    <h2>irNomad</h2>
                </div>
            </NavLink>
            {sessionUser && <button id="host" onClick={() => setCreate(true)}>Become a Host</button>}
            {create && <CreateSpotModal create={create} setCreate={setCreate} />}
            <button id='user-nav' onClick={() => setShowMenu(!showMenu)}>
                <i className="fa-solid fa-bars"></i>
                <i className="fa-solid fa-circle-user"></i>
            </button>
            {userLogin && <LoginFormModal userLogin={userLogin} setUserLogin={setUserLogin} />}
            {userSignup && <SignupFormModal userSignup={userSignup} setUserSignup={setUserSignup} />}
            {showMenu && <div id='expanded-menu'>
                {isLoaded && sessionLinks}
            </div>}

        </div>
    );
}

export default Navigation;
