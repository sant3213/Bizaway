export const FILTERS = {
    FASTEST: 'fastest',
    CHEAPEST: 'cheapest'
};

export const ERROR_MESSAGES = {
    MISSING_PARAMETER_SEARCH_TRIP: 'Missing required parameters: origin, destination',
    INVALID_SORT_BY: 'Invalid value for sort_by. Allowed values are "fastest" and "cheapest".',
    INVALID_ORIGIN_CODE: 'Invalid origin code',
    INVALID_DESTINATION_CODE: 'Invalid destination code',
    INTERNAL_SERVER_ERROR: 'Internal server error',
    MISSING_REQUIRED_FIELDS: 'Missing required fields to save trip',
    INVALID_COST_OR_DURATION: 'Invalid data type for cost or duration',
    MISSING_BODY_PARAMETER: (param: string) => `Missing required body parameter: ${param}`,
    TRIP_NOT_FOUND: 'Trip not found',
    TRIP_DELETED_SUCCESS: 'Trip deleted successfully',
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
