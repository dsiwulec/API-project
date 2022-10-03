const express = require('express');
const { setTokenCookie } = require('../../utils/auth');
const { User } = require('../../db/models');
const { validateSignup } = require('../../utils/validation');



const router = express.Router();

// Sign up
router.post(
    '/',
    validateSignup,
    async (req, res, next) => {
        const { firstName, lastName, email, password, username } = req.body;
        const existingEmail = await User.findOne({
            where: {
                email
            }
        })

        const existingUsername = await User.findOne({
            where: {
                username
            }
        })

        if (existingEmail) {
            const err = new Error('User already exists');
            err.title = 'Invalid email';
            err.errors = { "email": "User with that email already exists" };
            err.status = 403;
            return next(err);
        }

        if (existingUsername) {
            const err = new Error('User already exists');
            err.title = 'Invalid username';
            err.errors = { "email": "User with that username already exists" };
            err.status = 403;
            return next(err);
        }

        const user = await User.signup({ firstName, lastName, email, username, password });

        const token = setTokenCookie(res, user);

        return res.json({
            ...user.toSafeObject(),
            token
        });
    }
);

module.exports = router;
