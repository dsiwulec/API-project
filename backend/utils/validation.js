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
        .withMessage('Please provide a valid email.'),
    check('username')
        .exists({ checkFalsy: true })
        .isLength({ min: 4 })
        .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
        .not()
        .isEmail()
        .withMessage('Username cannot be an email.'),
    check('password')
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage('Password must be 6 characters or more.'),
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
        .withMessage('Street address is required'),
    check('city')
        .exists({ checkFalsy: true })
        .withMessage('City is required'),
    check('state')
        .exists({ checkFalsy: true })
        .withMessage('State is required'),
    check('country')
        .exists({ checkFalsy: true })
        .withMessage('Country is required'),
    check('lat')
        .exists({ checkFalsy: true })
        .withMessage('Latitude is required')
        .isFloat({ min: -90, max: 90 })
        .withMessage('Latitude is not valid'),
    check('lng')
        .exists({ checkFalsy: true })
        .withMessage('Longitude is required')
        .isFloat({ min: -180, max: 180 })
        .withMessage('Longitude is not valid'),
    check('name')
        .exists({ checkFalsy: true })
        .withMessage('Name is required')
        .isLength({ max: 49 })
        .withMessage('Name must be less than 50 characters'),
    check('description')
        .exists({ checkFalsy: true })
        .withMessage('Description is required'),
    check('price')
        .exists({ checkFalsy: true })
        .withMessage('Price per day is required'),
    handleValidationErrors
];

const validateReview = [
    check('review')
        .exists({ checkFalsy: true })
        .withMessage('Review text is required'),
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

// const queryValues = (pagination, where, page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice, next) => {

//     if (page && size) {
//         if (page >= 1 && size >= 1) {
//             pagination.limit = size
//             pagination.offset = size * (page - 1)
//         }

//         if (minLat) {
//             if (minLat > -90 && minLat < 90) {
//                 where.lat = { [Op.gte]: minLat }
//             } else {
//                 const err = new Error('Please enter a valid value for minLat');
//                 err.title = 'Invalid minLat value';
//                 err.errors = ['The minLat value must be between -90 and 90'];
//                 err.status = 400;
//                 next(err);
//                 return true;
//             }
//         }

//         if (maxLat) {
//             if (maxLat > -90 && maxLat < 90) {
//                 where.lat = { [Op.lte]: maxLat }
//             } else {
//                 const err = new Error('Please enter a valid value for maxLat');
//                 err.title = 'Invalid maxLat value';
//                 err.errors = ['The maxLat value must be between -90 and 90'];
//                 err.status = 400;
//                 next(err);
//                 return true;
//             }
//         }

//         if (minLng) {
//             if (minLng > -180 && minLng < 180) {
//                 where.lng = { [Op.gte]: minLng }
//             } else {
//                 const err = new Error('Please enter a valid value for minLng');
//                 err.title = 'Invalid minLng value';
//                 err.errors = ['The minLng value must be between -180 and 180'];
//                 err.status = 400;
//                 next(err);
//                 return true;
//             }
//         }

//         if (maxLng) {
//             if (maxLng > -180 && maxLng < 180) {
//                 where.lng = { [Op.lte]: maxLng }
//             } else {
//                 const err = new Error('Please enter a valid value for maxLng');
//                 err.title = 'Invalid maxLng value';
//                 err.errors = ['The maxLng value must be between -180 and 180'];
//                 err.status = 400;
//                 next(err);
//                 return true;
//             }
//         }

//         if (minPrice) {
//             if (minPrice > 0) {
//                 where.price = { [Op.gte]: minPrice }
//             } else {
//                 const err = new Error('Please enter a valid value for minPrice');
//                 err.title = 'Invalid minPrice value';
//                 err.errors = ['The minPrice value must be greater than 0'];
//                 err.status = 400;
//                 next(err);
//                 return true;
//             }
//         }

//         if (maxPrice) {
//             if (maxPrice > 0) {
//                 where.price = { [Op.lte]: maxPrice }
//             } else {
//                 const err = new Error('Please enter a valid value for maxPrice');
//                 err.title = 'Invalid maxPrice value';
//                 err.errors = ['The maxPrice value must be greater than 0'];
//                 err.status = 400;
//                 next(err);
//                 return true;
//             }
//         }
//     }
// }

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
