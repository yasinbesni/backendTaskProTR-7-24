import Joi from "joi";

export const createBoardSchema = Joi.object({
  title: Joi.string().min(1).required(),
  background: Joi.string().allow(null, ""),
});
