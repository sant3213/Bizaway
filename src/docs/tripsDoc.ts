import { ERROR_MESSAGES } from "../utils/constants.js";

export const listTripsDocs = {
  "/api/v1/trips": {
      "get": {
        "summary": "Retrieve all saved trips",
        "parameters": [
          {
            "in": "query",
            "name": "page",
            "schema": {
              "type": "integer",
              "example": 1
            },
            "required": false,
            "description": "Page number for pagination"
          },
          {
            "in": "query",
            "name": "limit",
            "schema": {
              "type": "integer",
              "example": 10
            },
            "required": false,
            "description": "Number of trips per page"
          }
        ],
        "description": "Fetches a list of all trips stored in the database.",
        "responses": {
          "200": {
            "description": "A list of saved trips",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": { "type": "string" },
                    "data": {
                      "type": "array",
                      "items": { "$ref": "#/components/schemas/Trip" },
                      "example": [
                        {
                          "origin": "SYD",
                          "destination": "GRU",
                          "cost": 625,
                          "duration": 5,
                          "type": "flight",
                          "id": "a749c866-7928-4d08-9d5c-a6821a583d1a",
                          "display_name": "from SYD to GRU by flight"
                        },
                        {
                          "origin": "SYD",
                          "destination": "GRU",
                          "cost": 1709,
                          "duration": 32,
                          "type": "car",
                          "id": "d1b89056-ae55-4040-bbd6-0373405705d4",
                          "display_name": "from SYD to GRU by car"
                        },
                        {
                          "origin": "SYD",
                          "destination": "GRU",
                          "cost": 4236,
                          "duration": 5,
                          "type": "train",
                          "id": "d6bbe5e5-be4d-40d5-9125-cedb57508897",
                          "display_name": "from SYD to GRU by train"
                        }
                      ]
                    },
                    "pagination": {
                      "type": "object",
                      "properties": {
                        "totalTrips": { "type": "integer" },
                        "currentPage": { "type": "integer" },
                        "totalPages": { "type": "integer" },
                        "limit": { "type": "integer" }
                      },
                      "example": {
                        "totalTrips": 50,
                        "currentPage": 1,
                        "totalPages": 5,
                        "limit": 10
                      }
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Invalid pagination parameters",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResponse"
                },
                "example": {
                  "error": ERROR_MESSAGES.INVALID_PAGE
                }
              }
            }
          },
         "500": {
          "description": ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ErrorResponse"
              },
              "example": {
                "error": ERROR_MESSAGES.INTERNAL_SERVER_ERROR
              }
            }
          }
        }
        }
      },
    post: {
      summary: "Save a trip",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                origin: {
                  type: "string",
                  description: "Origin city",
                  example: "ZRH",
                },
                destination: {
                  type: "string",
                  description: "Destination city",
                  example: "LAX",
                },
                duration: {
                  type: "number",
                  description: "Duration of the trip in hours",
                  example: 300,
                },
                cost: {
                  type: "number",
                  description: "Cost of the trip",
                  example: 100,
                },
                type: {
                  type: "string",
                  description: "Transportation modes ",
                  example: "flight",
                },
                id: {
                  type: "string",
                  description:
                    "A unique identifier for the trip in UUID format",
                  example: "a749c866-7928-4d08-9d5c-a6821a583d1t",
                },
                display_name: {
                  type: "string",
                  description: "the route and transportation mode",
                  example: "from SYD to GRU by train",
                },
              },
              required: [
                "origin",
                "destination",
                "duration",
                "cost",
                "type",
                "id",
                "display_name",
              ],
            },
          },
        },
      },
      responses: {
        201: {
          description: "Trip saved successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Trip",
              },
            },
          },
        },
        400: {
          description: "Missing required parameters or invalid data type",
        },
        500: {
          description: "Internal server error",
        },
      },
    },
  },
};
