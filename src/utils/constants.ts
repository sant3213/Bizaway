export const FILTERS = {
    FASTEST: 'fastest',
    CHEAPEST: 'cheapest'
};

export const ERROR_MESSAGES = {
    INVALID_SORT_BY: 'Invalid value for sort_by. Allowed values are "fastest" and "cheapest".',
    INVALID_ORIGIN_CODE: 'Invalid origin code',
    INVALID_DESTINATION_CODE: 'Invalid destination code',
    INTERNAL_SERVER_ERROR: 'Internal server error',
    INVALID_COST_OR_DURATION: 'Invalid data type for cost or duration',
    MISSING_BODY_PARAMETER: (param: string) => `Missing required body parameter: ${param}`,
    MISSING_QUERY_PARAMETER: (param: string) => `Missing required query parameter: ${param}`,
    EXTERNAL_API_ERROR: (param: string) => `External API error: ${param}`,
    TRIP_NOT_FOUND: 'Trip not found',
    SAME_ORIGIN_DESTINATION: 'Origin and destination cannot be the same',
    INVALID_PAGE: "Invalid value for page. Must be a positive integer.",
    INVALID_LIMIT: "Invalid value for limit. Must be a positive integer.",
};

export const SUCCESS_MESSAGES = {
    TRIPS: {
        FETCH_SUCCESS: 'Trips fetched successfully',
        SAVE_SUCCESS: 'Trip saved successfully',
        DELETE_SUCCESS: 'Trip deleted successfully',
    }
};

export const API_URLS = {
    TRIPS: process.env.TRTRIPS_API_URL
};

export const HEADERS = {
    API_KEY_HEADER: 'x-api-key'
};
