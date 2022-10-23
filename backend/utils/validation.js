const { validationResult } = require('express-validator');
const { check } = require('express-validator');
const { Op } = require("sequelize")

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, _res, next) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        const errors = validationErrors
            .array({ onlyFirstError: true })
            .map((error) => `${error.msg}`);

        const err = Error('Validation error');
        err.errors = errors;
        err.status = 400;
        err.title = 'Bad request';
        next(err);
    }
    next();
};

const validateSignup = [
    check('email')
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage('Please provide a valid email.')
        .isLength({ max: 50 })
        .withMessage('Email must be 50 characters or less'),
    check('username')
        .exists({ checkFalsy: true })
        .isLength({ min: 4, max: 50 })
        .withMessage('Usernames must be betwwen 4 and 50 characters'),
    check('username')
        .not()
        .isEmail()
        .withMessage('Username cannot be an email.'),
    check('password')
        .exists({ checkFalsy: true })
        .isLength({ min: 6, max: 50 })
        .withMessage('Password must be between 6 and 50 characters'),
    handleValidationErrors
];

const validateLogin = [
    check('credential')
        .exists({ checkFalsy: true })
        .withMessage('Email or username is required'),
    check('password')
        .exists({ checkFalsy: true })
        .withMessage('Password is required'),
    handleValidationErrors
];

const validateSpot = [
    check('address')
        .exists({ checkFalsy: true })
        .withMessage('Address is required')
        .isLength({ max: 100 })
        .withMessage('Addresses must be 100 characters or less'),
    check('city')
        .exists({ checkFalsy: true })
        .withMessage('City is required')
        .isLength({ max: 100 })
        .withMessage('City names must be 100 characters or less'),
    check('state')
        .exists({ checkFalsy: true })
        .withMessage('State is required')
        .isLength({ max: 100 })
        .withMessage('State names must be 100 characters or less'),
    check('country')
        .exists({ checkFalsy: true })
        .withMessage('Country is required')
        .isLength({ max: 100 })
        .withMessage('Country names must be 100 characters or less'),
    check('name')
        .exists({ checkFalsy: true })
        .withMessage('Name is required')
        .isLength({ max: 100 })
        .withMessage('Names must be 100 characters or less'),
    check('description')
        .exists({ checkFalsy: true })
        .withMessage('Description is required')
        .isLength({ max: 1000 })
        .withMessage('Descriptions must be 1000 characters or less'),
    check('price')
        .exists({ checkFalsy: true })
        .withMessage('Price per day is required')
        .isInt()
        .withMessage('Price must be an integer')
        .isInt({ min: 1 })
        .withMessage('Price must be at least 1'),
    // check('lat')
    //     .exists({ checkFalsy: true })
    //     .withMessage('Latitude is required')
    //     .isFloat({ min: -90, max: 90 })
    //     .withMessage('Latitude is not valid'),
    // check('lng')
    //     .exists({ checkFalsy: true })
    //     .withMessage('Longitude is required')
    //     .isFloat({ min: -180, max: 180 })
    //     .withMessage('Longitude is not valid'),
    handleValidationErrors
];

const validateReview = [
    check('review')
        .exists({ checkFalsy: true })
        .withMessage('Review text is required')
        .isLength({ max: 1000 })
        .withMessage('Reviews must be 1000 characters or less'),
    check('stars')
        .exists({ checkFalsy: true })
        .withMessage('Stars is required')
        .isInt({ min: 1, max: 5 })
        .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
];

const validateBooking = [
    check('startDate')
        .exists({ checkFalsy: true })
        .withMessage('startDate is required')
        .custom((startDate, { req, _location, _path }) => {
            const { endDate } = req.body
            if (!endDate) return true
            if (startDate < endDate) return true

            throw new Error('endDate cannot be on or before startDate')
        }),
    check('endDate')
        .exists({ checkFalsy: true })
        .withMessage('endDate is required'),
    handleValidationErrors
]

const validateQueryFilters = [
    check('page')
        .if(check('page').exists())
        .isInt({ min: 0, max: 10 })
        .withMessage("Page must be greater than or equal to 0 and less than or equal to 10"),
    check('size')
        .if(check('size').exists())
        .isInt({ min: 0, max: 20 })
        .withMessage("Size must be greater than or equal to 0 and less than or equal to 20"),
    check('minLat')
        .if(check('minLat').exists())
        .isFloat({ min: -90, max: 90 })
        .withMessage("Minimum latitude is invalid"),
    check('maxLat')
        .if(check('maxLat').exists())
        .isFloat({ min: -90, max: 90 })
        .withMessage("Maximum latitude is invalid"),
    check('minLng')
        .if(check('minLng').exists())
        .isFloat({ min: -180, max: 180 })
        .withMessage("Minimum longitude is invalid"),
    check('maxLng')
        .if(check('maxLng').exists())
        .isFloat({ min: -180, max: 180 })
        .withMessage("Maximum longitude is invalid"),
    check('minPrice')
        .if(check('minPrice').exists())
        .isInt({ min: 0 })
        .withMessage("Minimum price must be greater than or equal to 0"),
    check('maxPrice')
        .if(check('maxPrice').exists())
        .isInt({ min: 0 })
        .withMessage("Maximum price must be greater than or equal to 0"),
    handleValidationErrors
]

const assignSearchFilters = (pagination, where, page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice, next) => {

    if (page && size) {
        pagination.limit = size
        pagination.offset = size * (page - 1)
    }

    if (minLat) where.lat = { [Op.gte]: minLat }

    if (maxLat) where.lat = { [Op.lte]: maxLat }

    if (minLng) where.lng = { [Op.gte]: minLng }

    if (maxLng) where.lng = { [Op.lte]: maxLng }

    if (minPrice) where.price = { [Op.gte]: minPrice }

    if (maxPrice) where.price = { [Op.lte]: maxPrice }
}

module.exports = {
    handleValidationErrors,
    validateSignup,
    validateLogin,
    validateSpot,
    validateReview,
    validateBooking,
    validateQueryFilters,
    assignSearchFilters
};
