const { check } = require('express-validator');

exports.createUpdateRequest = [
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
    check('age')
        .notEmpty()  
        .withMessage('Age is required')
        .isLength({min: 1})
        .withMessage('Age min length 1 symbol')
  ];