import Joi from "joi";

export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

export const customerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().allow(""),
  company: Joi.string().allow("")
});

// For updating customers, all fields optional
export const customerUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  email: Joi.string().email(),
  phone: Joi.string().allow(""),
  company: Joi.string().allow("")
});

export const leadSchema = Joi.object({
  title: Joi.string().min(2).max(100).required(),
  description: Joi.string().allow(""),
  status: Joi.string().valid("New", "Contacted", "Converted", "Lost"),
  value: Joi.number().min(0),
  createdAt: Joi.date()
});

// For updating leads, allow partial updates
export const leadUpdateSchema = Joi.object({
  title: Joi.string().min(2).max(100),
  description: Joi.string().allow(""),
  status: Joi.string().valid("New", "Contacted", "Converted", "Lost"),
  value: Joi.number().min(0)
});
