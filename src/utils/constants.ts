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
    TRIP_NOT_FOUND: 'Trip not found',
};

export const SUCCESS_MESSAGES = {
    TRIPS: {
        FETCH_SUCCESS: 'Trips fetched successfully',
        SAVE_SUCCESS: 'Trip saved successfully',
        DELETE_SUCCESS: 'Trip deleted successfully',
    }
};

export const API_URLS = {
    TRIPS: 'https://z0qw1e7jpd.execute-api.eu-west-1.amazonaws.com/default/trips'
};

export const HEADERS = {
    API_KEY_HEADER: 'x-api-key'
};
