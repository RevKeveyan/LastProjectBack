const { check } = require('express-validator');

exports.createPost = [
    check('title')
        .notEmpty()  
        .withMessage('Title is required')
        .isLength({min: 2})
        .withMessage('Title is not valid'),
    check('description')
        .notEmpty()  
        .withMessage('Description is required')
        .isLength({min: 8})
        .withMessage('Description min length 8 symbol'),

  ]; 