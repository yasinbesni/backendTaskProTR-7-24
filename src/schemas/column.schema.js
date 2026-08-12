import Joi from 'joi';

export const createColumnSchema = Joi.object({
  title: Joi.string().min(1).max(50).required(),
  boardId: Joi.string().hex().length(24).required(),
});

export const updateColumnSchema = Joi.object({
  title: Joi.string().min(1).max(50).optional(),
}).min(1);

export default {
  createColumnSchema,
  updateColumnSchema,
};
