import Joi from "joi";
import { ERROR_MESSAGES, FILTERS } from "../utils/constants.js";
import { VALID_AIRPORT_CODES } from "../utils/airportCodes.js";

export const searchValidatorSchema = Joi.object({
  origin: Joi.string()
    .valid(...VALID_AIRPORT_CODES)
    .required()
    .messages({
      "any.required": ERROR_MESSAGES.MISSING_QUERY_PARAMETER("origin"),
      "any.only": ERROR_MESSAGES.INVALID_ORIGIN_CODE,
    }),
  destination: Joi.string()
    .valid(...VALID_AIRPORT_CODES)
    .required()
    .messages({
      "any.required": ERROR_MESSAGES.MISSING_QUERY_PARAMETER("destination"),
      "any.only": ERROR_MESSAGES.INVALID_DESTINATION_CODE,
    }),
  sort_by: Joi.string()
    .valid(FILTERS.FASTEST, FILTERS.CHEAPEST)
    .optional()
    .messages({
      "any.only": ERROR_MESSAGES.INVALID_SORT_BY,
    }),
});

export const saveValidatorSchema = Joi.object({
  origin: Joi.string().required(),
  destination: Joi.string().required(),
  cost: Joi.number().required(),
  duration: Joi.number().required(),
  type: Joi.string().required(),
  id: Joi.string().required(),
  display_name: Joi.string().required(),
});
