export const getTripDocs = {
    '/search-trips': {
        get: {
            summary: 'Search for trips based on origin, destination, and sorting options',
            parameters: [
                {
                    in: 'query',
                    name: 'origin',
                    schema: {
                        type: 'string',
                    },
                    required: true,
                    description: 'Origin city',
                },
                {
                    in: 'query',
                    name: 'destination',
                    schema: {
                        type: 'string',
                    },
                    required: true,
                    description: 'Destination city',
                },
                {
                    in: 'query',
                    name: 'sort_by',
                    schema: {
                        type: 'string',
                        enum: ['fastest', 'cheapest'],
                    },
                    required: false,
                    description: "Optional sorting: 'fastest' or 'cheapest'",
                },
            ],
            responses: {
                200: {
                    description: 'A list of trips',
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
                400: {
                    description: 'Invalid parameters (e.g., invalid IATA codes)',
                },
                500: {
                    description: 'Internal server error',
                },
            }
        },
    },
};