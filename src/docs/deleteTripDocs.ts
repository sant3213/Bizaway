import { ERROR_MESSAGES } from "../utils/constants.js";

export const deleteTripDocs = {
    '/trips/{id}': {
      delete: {
        summary: 'Delete a trip by ID',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: {
              type: 'string',
              description: 'ID of the trip to delete',
            },
          },
        ],
        responses: {
          200: {
            description: ERROR_MESSAGES.TRIP_DELETED_SUCCESS,
          },
          404: {
            description: ERROR_MESSAGES.TRIP_NOT_FOUND,
          },
          500: {
            description: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
          },
        },
      },
    },
  };
  