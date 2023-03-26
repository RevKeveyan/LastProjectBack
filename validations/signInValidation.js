const { check } = require('express-validator');

exports.createUserSignIn = [
    check('email')
        .notEmpty()  
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Email is not valid'),
    check('password')
        .notEmpty()  
        .withMessage('password is required')
        .isLength({min: 8})
        .withMessage('password min length 8 symbol'),

  ];