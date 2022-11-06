import { body } from 'express-validator';

export default {
  fund: [body('amount').exists().isInt().withMessage('value must be a number')],
  transfer: [
    body('amount').exists().isInt().withMessage('value must be a number'),
    body('userId').exists().isInt().withMessage('value must be a number'),
  ],
  withdraw: [
    body('amount').exists().isInt().withMessage('value must be a number'),
    body('accountNumber')
      .exists()
      .isInt()
      .withMessage('value must be a number')
      .isLength({ min: 10, max: 10 })
      .withMessage('account number must have 10 digits'),
    body('accountName').exists().isString().withMessage('value must be a string'),
  ],
};
