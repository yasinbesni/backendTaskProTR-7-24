import Joi from "joi";

export const helpSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email address",
    "any.required": "Email is required",
  }),
  comment: Joi.string().min(5).max(1000).required().messages({
    "string.min": "Comment must be at least 5 characters",
    "string.max": "Comment cannot exceed 1000 characters",
    "any.required": "Comment is required",
  }),
});
