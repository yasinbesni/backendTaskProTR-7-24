import Joi from 'joi';
import ApiError from '../helpers/ApiError.js';

// Validation middleware
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(', ');
      return next(new ApiError(400, errorMessage));
    }

    next();
  };
};

export { validate };
