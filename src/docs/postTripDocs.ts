export const postTripDocs = {
    '/trips': {
      post: {
        summary: 'Save a trip',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  origin: { type: 'string', description: 'Origin city', example: 'NYC' },
                  destination: { type: 'string', description: 'Destination city', example: 'LAX' },
                  duration: { type: 'number', description: 'Duration of the trip in minutes', example: 300 },
                  cost: { type: 'number', description: 'Cost of the trip', example: 100 },
                },
                required: ['origin', 'destination', 'duration', 'cost'],
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Trip saved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  $ref: '#/components/schemas/Trip',
                },
              },
            },
          },
          400: {
            description: 'Invalid input data',
          },
        },
      },
    },
  };
  