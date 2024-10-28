import Joi from 'joi';
import { FILTERS } from '../utils/constants.js';

export const searchValidatorSchema = Joi.object({
  origin: Joi.string().required(),
  destination: Joi.string().required(),
  sort_by: Joi.string().valid(FILTERS.FASTEST, FILTERS.CHEAPEST).required(),
});

export const saveValidatorSchema = Joi.object({
  origin:  Joi.string().required(),
  destination: Joi.string().required(),
  cost: Joi.number().required(),
  duration: Joi.number().required(),
  type:  Joi.string().required(),
  id:  Joi.string().required(),
  display_name:  Joi.string().required(),
})
