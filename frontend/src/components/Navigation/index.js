import React from 'react';
import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import './Navigation.css';
import logo from '../../assets/logo.png'

function Navigation({ isLoaded }) {
    const sessionUser = useSelector(state => state.session.user);
    const [menuState, setMenuState] = useState(false)

    let sessionLinks;
    if (sessionUser) {
        sessionLinks = (
            <ProfileButton user={sessionUser} />
        );
    } else {
        sessionLinks = (
            <>
                <LoginFormModal />
                <SignupFormModal />
            </>
        );
    }

    // useEffect(() => {
    //     window.addEventListener('click', event => {
    //         if (event.target.closest('#user-nav') === null) {
    //             setMenuState(false)
    //         }
    //     });
    // }, [])

    const toggleMenu = () => {
        setMenuState(!menuState)
    }

    return (
        <div className='nav-bar'>
            <NavLink exact to="/" >
                <img id='home-logo' src={logo} alt="logo" />
            </NavLink>
            <button id='user-nav' onClick={toggleMenu}>
                <i className="fa-solid fa-bars"></i>
                <i className="fa-solid fa-circle-user"></i>
            </button>
            {menuState && <div id='expanded-menu'>
                {menuState && isLoaded && sessionLinks}
            </div>}
        </div>
    );
}

export default Navigation;
