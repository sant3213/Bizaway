export const listTripsDocs = {
    '/trips': {
      get: {
        summary: 'Retrieve all saved trips',
        description: 'Fetches a list of all trips stored in the database.',
        responses: {
          200: {
            description: 'A list of saved trips',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Trip',
                  },
                },
              },
            },
          },
          500: {
            description: 'Internal server error',
          },
        },
      },
    },
  };
  