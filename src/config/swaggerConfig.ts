import { Options } from 'swagger-jsdoc';
import { tripDocs } from '../docs/tripDocs.js';

export const swaggerConfig: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Bizaway Test API',
      version: '1.0.0',
      description: 'API documentation for Bizaway Test project',
      contact: {
        name: 'Santiago'
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],

    components: {
      schemas: {
        Trip: {
          type: 'object',
          properties: {
            origin: {
              type: 'string',
              description: 'Origin city',
            },
            destination: {
              type: 'string',
              description: 'Destination city',
            },
            duration: {
              type: 'number',
              description: 'Duration of the trip',
            },
            cost: {
              type: 'number',
              description: 'Cost of the trip',
            },
            type: {
              type: 'string',
              description: 'Type of the trip',
            },
            display_name: {
              type: 'string',
              description: 'Destination and origin of the trip',
            },
            id: {
              type: 'string',
              description: 'A UUID of the trip',
            },
          },
        },
      },
    },
    paths: {
      ...tripDocs,
    },
  },
  apis: [],
};
