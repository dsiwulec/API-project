import React from 'react';
import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import CreateSpotModal from '../CreateSpotModal';
import './Navigation.css';
import logo from '../../assets/logo.png'

function Navigation({ isLoaded }) {
    const sessionUser = useSelector(state => state.session.user);
    const [showMenu, setShowMenu] = useState(false)

    let sessionLinks;
    if (sessionUser) {
        sessionLinks = (
            <ProfileButton user={sessionUser} />
        );
    } else {
        sessionLinks = (
            <>
                <LoginFormModal className="modal" />
                <SignupFormModal className="modal" />
            </>
        );
    }

    const toggleMenu = () => {
        setShowMenu(!showMenu)
    }

    // const openMenu = () => {
    //     if (showMenu) return;
    //     setShowMenu(true);
    // };

    // useEffect(() => {
    //     if (!showMenu) return;

    //     const closeMenu = (event) => {
    //         if (event.currentTarget !== '.modal') setShowMenu(false);
    //     };

    //     document.addEventListener('click', closeMenu);

    //     return () => document.removeEventListener("click", closeMenu);
    // }, [showMenu]);

    return (
        <div className='nav-bar'>
            <NavLink exact to="/" >
                <img id='home-logo' src={logo} alt="logo" />
            </NavLink>
            {sessionUser && <CreateSpotModal />}
            <button id='user-nav' onClick={toggleMenu}>
                <i className="fa-solid fa-bars"></i>
                <i className="fa-solid fa-circle-user"></i>
            </button>
            {showMenu && <div id='expanded-menu'>
                {showMenu && isLoaded && sessionLinks}
            </div>}
        </div>
    );
}

export default Navigation;
