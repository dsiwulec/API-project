const express = require('express');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');
const { validateLogin } = require('../../utils/validation');


const router = express.Router();

// Log in
router.post(
    '/',
    validateLogin,
    async (req, res, next) => {
        const { credential, password } = req.body;

        const user = await User.login({ credential, password });

        if (!user) {
            const err = new Error('Invalid credentials');
            err.status = 401;
            err.title = 'Login failed';
            err.errors = ['The provided credentials were invalid.'];
            return next(err);
        }

        const token = setTokenCookie(res, user);

        return res.json({
            ...user.toSafeObject(),
            token
        });
    }
);

// Log out
router.delete(
    '/',
    (_req, res) => {
        res.clearCookie('token');
        return res.json({ message: 'success' });
    }
);

// Restore session user
router.get(
    '/',
    restoreUser,
    (req, res) => {
        const { user } = req;
        if (user) {
            setTokenCookie(res, user);
            return res.json({
                ...user.toSafeObject(),
            });
        } else return res.json({});
    }
);

module.exports = router;
