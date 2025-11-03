import { body, param, validationResult } from 'express-validator';

export const validateCreateTask = [
  body('title').notEmpty().withMessage('Title is required').trim().escape(),
  body('description').optional().trim().escape(),
  body('status').isIn(['todo', 'progress', 'done']).withMessage('Status must be todo, progress or done'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
]

export const validateUpdateTask = [
  body('title').optional().notEmpty().withMessage('Title is required').trim().escape(),
  body('description').optional().trim().escape(),
  body('status').optional().isIn(['todo', 'progress', 'done']).withMessage('Status must be todo, progress or done'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
]

export const validateMongoId = [
  param('id').isMongoId().withMessage('Invalid task ID'),
]

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}