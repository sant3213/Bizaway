import Joi, { CustomHelpers } from "joi";
import { ERROR_MESSAGES, FILTERS } from "../utils/constants.js";
import { VALID_AIRPORT_CODES } from "../utils/airportCodes.js";

interface SearchParams {
  origin: string;
  destination: string;
  sort_by?: string;
}


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
}).custom((value: SearchParams, helpers: CustomHelpers) => {
  if (value.origin === value.destination) {
    return helpers.error("any.invalid", { message: ERROR_MESSAGES.SAME_ORIGIN_DESTINATION });
  }
  return value;
})
.messages({
  "any.invalid": ERROR_MESSAGES.SAME_ORIGIN_DESTINATION,
});

export const saveValidatorSchema = Joi.object({
  origin: Joi.string().required().messages({
    "any.required": ERROR_MESSAGES.MISSING_BODY_PARAMETER("origin"),
  }),
  destination: Joi.string().required().messages({
    "any.required": ERROR_MESSAGES.MISSING_BODY_PARAMETER("destination"),
  }),
  cost: Joi.number().required().messages({
    "any.required": ERROR_MESSAGES.MISSING_BODY_PARAMETER("cost"),
  }),
  duration: Joi.number().required().messages({
    "any.required": ERROR_MESSAGES.MISSING_BODY_PARAMETER("duration"),
  }),
  type: Joi.string().required().messages({
    "any.required": ERROR_MESSAGES.MISSING_BODY_PARAMETER("type"),
  }),
  id: Joi.string().required().messages({
    "any.required": ERROR_MESSAGES.MISSING_BODY_PARAMETER("id"),
  }),
  display_name: Joi.string().required().messages({
    "any.required": ERROR_MESSAGES.MISSING_BODY_PARAMETER("display_name"),
  }),
});

export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).optional().messages({
    "number.base": ERROR_MESSAGES.INVALID_PAGE,
    "number.min": ERROR_MESSAGES.INVALID_PAGE,
  }),
  limit: Joi.number().integer().min(1).optional().messages({
    "number.base": ERROR_MESSAGES.INVALID_LIMIT,
    "number.min": ERROR_MESSAGES.INVALID_LIMIT,
  }),
});
