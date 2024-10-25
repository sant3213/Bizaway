import Joi from 'joi';
import { FILTERS } from '../utils/constants.js';

export const tripSchema = Joi.object({
  origin: Joi.string().required(),
  destination: Joi.string().required(),
  sort_by: Joi.string().valid(FILTERS.FASTEST, FILTERS.CHEAPEST).required(),
});
