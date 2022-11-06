import { body, param } from 'express-validator';

export default {
  login: [body('username').exists().isString(), body('password').exists()],
  signup: [
    body('username').exists().isString().withMessage('value must be a string'),
    body('firstname').exists().isString().withMessage('value must be a string'),
    body('lastname').exists().isString().withMessage('value must be a string'),
    body('password').exists().isString().withMessage('value must be a string'),
  ],
  id: [param('userId').exists()],
};
