import Joi from "joi";

const passwordRule = Joi.string()
	.min(8)
	.pattern(new RegExp('(?=.*[A-Za-z])'))
	.messages({
		'string.min': 'Password must be at least 8 characters long',
		'string.pattern.base': 'Password must contain at least one letter',
	});

export const updateProfileSchema = Joi.object({
	name: Joi.string().min(2).max(40).optional(),
	email: Joi.string().email().optional(),
	password: passwordRule.optional(),
	avatar: Joi.string()
		.max(2 * 1024 * 1024)
		.allow(null, "")
		.optional()
		.messages({
			'string.max': 'Avatar image is too large',
		}),
	theme: Joi.string().valid("light", "dark", "violet", "Light", "Violet", "Dark").optional(),
}).min(1);

export const registerSchema = Joi.object({
	name: Joi.string().min(2).max(40).required(),
	email: Joi.string().email().required(),
	password: passwordRule.required(),
});
