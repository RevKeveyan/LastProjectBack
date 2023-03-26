const { check } = require('express-validator');

exports.createUserSignUp = [
    check('firstName')
        .notEmpty()
        .withMessage('Name field is required')
        .isLength({ min: 2 })
        .withMessage('Name min length 6 symbol.'),
    check('lastName')
        .notEmpty()
        .withMessage('Last Name field is required')
        .isLength({ min: 2 })
        .withMessage('Last Name min length 6 symbol.'),
    check('email')
        .notEmpty()  
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Email is not valid'),
    check('age')
        .notEmpty()  
        .withMessage('Age is required')
        .isLength({min: 1})
        .withMessage('Age min length 1 symbol'),
    check('password')
        .notEmpty()  
        .withMessage('password is required')
        .isLength({min: 8})
        .withMessage('password min length 8 symbol'),
    
  ];