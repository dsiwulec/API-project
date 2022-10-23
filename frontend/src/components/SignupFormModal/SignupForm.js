import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import './SignupForm.css';
import * as sessionActions from "../../store/session";

function SignupFormPage() {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [characterCount, setCharacterCount] = useState(0)
    const [errors, setErrors] = useState([]);

    if (sessionUser) return <Redirect to="/" />;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === confirmPassword) {
            setErrors([]);
            return dispatch(sessionActions.signup({ firstName, lastName, username, email, password }))
                .catch(async (res) => {
                    const data = await res.json();
                    if (data && data.errors) setErrors(Object.values(data.errors));
                });
        }
        return setErrors(['Confirm Password field must be the same as the Password field']);
    };

    return (
        <form onSubmit={handleSubmit}>
            {errors.length > 0 && <ul>
                {errors.map((error, idx) => <li key={idx}>{error}</li>)}
            </ul>}
            <h2 className="header-text">Welcome to Airbnb</h2>
            First Name
            <div className="input-group">
                <input
                    className="signup"
                    placeholder="First Name"
                    type="text"
                    value={firstName}
                    onChange={(e) => {
                        setFirstName(e.target.value)
                        setCharacterCount(e.target.value.length)
                    }}
                    required
                    maxLength={25}
                    onFocus={(e) => setCharacterCount(e.target.value.length)}
                />
                <div className="character-count">{characterCount}/25</div>
            </div>

            Last Name
            <div className="input-group">
                <input
                    className="signup"
                    placeholder="Last Name"
                    type="text"
                    value={lastName}
                    onChange={(e) => {
                        setLastName(e.target.value)
                        setCharacterCount(e.target.value.length)
                    }}
                    required
                    maxLength={25}
                    onFocus={(e) => setCharacterCount(e.target.value.length)}
                />
                <div className="character-count">{characterCount}/25</div>
            </div>

            Email
            <div className="input-group">
                <input
                    className="signup"
                    placeholder="Email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value)
                        setCharacterCount(e.target.value.length)
                    }}
                    required
                    maxLength={50}
                    onFocus={(e) => setCharacterCount(e.target.value.length)}
                />
                <div className="character-count">{characterCount}/50</div>
            </div>

            Username
            <div className="input-group">
                <input
                    className="signup"
                    placeholder="Username"
                    type="text"
                    value={username}
                    onChange={(e) => {
                        setUsername(e.target.value)
                        setCharacterCount(e.target.value.length)
                    }}
                    required
                    maxLength={25}
                    onFocus={(e) => setCharacterCount(e.target.value.length)}
                />
                <div className="character-count">{characterCount}/25</div>
            </div>

            Password
            <div className="input-group">
                <input
                    className="signup"
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value)
                        setCharacterCount(e.target.value.length)
                    }}
                    required
                    minLength={6}
                    maxLength={50}
                />
                <div className="character-count">{characterCount}/50</div>
            </div>
            Confirm Password
            <div className="input-group">
                <input
                    className="signup"
                    placeholder="Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => {
                        setConfirmPassword(e.target.value)
                        setCharacterCount(e.target.value.length)
                    }}
                    required
                    minLength={6}
                    maxLength={50}
                />
                <div className="character-count">{characterCount}/50</div>
            </div>

            <button id="signup-button" type="submit">Sign Up</button>
        </form>
    );
}

export default SignupFormPage;
