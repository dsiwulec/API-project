import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';

function ProfileButton({ user }) {
    const dispatch = useDispatch();

    const logout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.logout());
    };

    return (
        <>
            <div>{user.username}</div>
            <div>{user.email}</div>
            <button onClick={logout}>Log Out</button>
        </>
    );
}

export default ProfileButton;
