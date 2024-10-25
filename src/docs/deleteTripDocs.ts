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
            description: 'Trip deleted successfully',
          },
          404: {
            description: 'Trip not found',
          },
          500: {
            description: 'Internal server error',
          },
        },
      },
    },
  };
  