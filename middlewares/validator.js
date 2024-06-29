const { body, query, param, validationResult } = require('express-validator');

exports.loginApp = [
  query('phone')
    .exists()
    .withMessage('Phone is required')
    .trim()
    .isMobilePhone(['vi-VN'])
    .withMessage('Invalid phone number'),
];

exports.registerCode = [
  body('phone')
    .exists()
    .withMessage('Phone is required')
    .trim()
    .isMobilePhone(['vi-VN'])
    .withMessage('Invalid phone number'),
  body('code')
    .exists()
    .withMessage('Register code is required')
    .trim()
    .isLength({ min: 6, max: 6 })
    .withMessage('Register Code must be 6 digits'),
];

exports.ObjectId = [param('id').isMongoId().withMessage('Invalid ObjectId')];

exports.result = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ message: 'Validation Error', errors: errors.array() });
  }

  next();
};
