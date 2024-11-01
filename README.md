# Trip Management API

This project is an API to manage and query trip information. It is built with Node.js, Express, and MongoDB, and uses Docker for containerization. The API provides endpoints for listing and managing trips, with Swagger documentation for easy exploration.

## Table of Contents

- [Trip Management API](#trip-management-api)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Installation](#installation)
      - [Running the Application](#running-the-application)
  - [Accessing the Application](#accessing-the-application)
      - [Running in Production Mode](#running-in-production-mode)
  - [Middleware](#middleware)
  - [Testing](#testing)
  - [API Documentation](#api-documentation)
  - [Usage](#usage)
    - [Trip Endpoints](#trip-endpoints)
    - [Search Endpoints](#search-endpoints)
    - [Valid Airport Codes](#valid-airport-codes)
    - [Caching](#caching)
  - [Project Structure](#project-structure)
  - [Troubleshooting](#troubleshooting)
  - [Compromises or Assumptions](#compromises-or-assumptions)

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) must be installed on your machine to run the application in containers.
- A valid API key and URL to query trips.
- [Redis](https://redis.io/) is used for caching API responses. It is configured via Docker and requires the `REDIS_URL` environment variable.

## Environment Variables

- Create a `.env` file in the root of the project with the following variables:

  ```bash
  API_KEY=<YourAPIKEY>
  TRIPS_API_URL=<APIToQueryTrips>
  MONGODB_URI_DEV=mongodb://root:password@mongo:27017/trip_dev?authSource=admin
  MONGODB_URI_TEST=mongodb://root:password@mongo:27017/trip_test?authSource=admin
  MONGODB_URI_PROD=mongodb://root:password@mongo:27017/trip_prod?authSource=admin
  PORT=3000
  REDIS_URL=redis://redis:6379
  ```

## Installation
- Clone the repository from [https://github.com/sant3213/Bizaway.git](https://github.com/sant3213/Bizaway.git)
  ```bash
  git clone https://github.com/sant3213/Bizaway.git
  cd Bizaway
  ```

Make sure Docker is running.

Add the .env file as described above.

#### Running the Application in development mode
- To build and start the application with Docker, run the following docker command in the root directory of the project:

  ```bash
  docker-compose --profile dev up --build
  ```
#### Running in Production Mode
- To run the application in production mode, use:
  ```bash
  docker-compose --profile prod up --build
  ```

This will start the application, and it will be accessible at [http://localhost:3000](http://localhost:3000).

## Accessing the Application
- API: Use Postman or any HTTP client to send requests to [http://localhost:3000](http://localhost:3000).
- Swagger Documentation: Open [http://localhost:3000/api-docs](http://localhost:3000/api-docs) in your browser to view the Swagger API documentation.


## Middleware
- **Security Headers with Helmet:** The API uses helmet to set secure HTTP headers, which helps protect against common web vulnerabilities. This setup includes protections like X-Frame-Options to prevent clickjacking, Strict-Transport-Security for HTTPS enforcement, and X-XSS-Protection to mitigate cross-site scripting (XSS) attacks.
  
- **Error Handling**: Errors are managed using custom error classes (e.g., `AppError`, `ValidationError`, `ExternalApiError`).
  
- **Validation**: `Joi` is used to validate request parameters and body content to ensure API integrity.


## Testing
- To run tests with Docker, use:

    ```bash
    docker-compose -f docker-compose.yml -f docker-compose.test.yml --profile test up --build test
    ```

Alternatively, you can run tests locally without Docker:

1. Install dependencies if not already installed:
      
    ```bash
    npm install
    npm test
    ```
2. Run tests: 
    ```bash
    npm test
    ```
    This will execute all unit tests for the application.

After running tests, a coverage folder is generated in the project directory. To view test coverage details, open the HTML report in a browser by navigating to coverage/index.html. This report provides an overview of the coverage for each test.

## API Documentation
The API documentation is available via Swagger at [http://localhost:3000/api-docs](http://localhost:3000/api-docs). This provides detailed information on available endpoints, request/response structures, and example calls.

## Usage
1. Start the application as described above.
2. Use tools like Postman or Swagger to interact with the API.
3. Example endpoints include:
   
### Trip Endpoints

- `GET /api/v1/trips`
  - **Description**: Retrieve all saved trips.
  - **Query Parameters**:
    - `page` (optional): Page number for pagination (e.g., `1`).
    - `limit` (optional): Number of trips per page (e.g., `10`).
  - **Response**: A paginated list of trips.

- `POST /api/v1/trips`
  - **Description**: Save a new trip.
  - **Request Body**:
    - `origin` (string): Origin city (e.g., "NYC").
    - `destination` (string): Destination city (e.g., "LAX").
    - `duration` (number): Duration of the trip in hours (e.g., `300`).
    - `cost` (number): Cost of the trip (e.g., `100`).
    - `type` (string): Transportation mode (e.g., "flight").
    - `id` (string): Unique identifier for the trip in UUID format.
    - `display_name` (string): Route and transportation mode description (e.g., "from SYD to GRU by train").
  - **Response**: Confirms trip was saved successfully or returns validation errors.

- `DELETE /api/v1/trips/{id}`
  - **Description**: Delete a trip by its unique ID.
  - **Path Parameter**:
    - `id` (string): The ID of the trip to delete.
  - **Response**: Confirmation of deletion or a not-found error if the ID doesn't match any trip.

### Search Endpoints

- `GET /api/v1/search-trips`
  - **Description**: Search for trips based on origin, destination, and optional sorting.
  - **Query Parameters**:
    - `origin` (string, required): Origin city.
    - `destination` (string, required): Destination city.
    - `sort_by` (string, optional): Sorting criteria (`fastest` or `cheapest`).
  - **Response**: A list of trips matching the search criteria.

### Valid Airport Codes

The API includes validation for origin and destination parameters based on a predefined set of airport codes. The following codes are supported:

```ts
export const VALID_AIRPORT_CODES = [
  "ATL", "PEK", "LAX", "DXB", "HND", "ORD", "LHR", "PVG", "CDG", "DFW",
  "AMS", "FRA", "IST", "CAN", "JFK", "SIN", "DEN", "ICN", "BKK", "SFO",
  "LAS", "CLT", "MIA", "KUL", "SEA", "MUC", "EWR", "MAD", "HKG", "MCO",
  "PHX", "IAH", "SYD", "MEL", "GRU", "YYZ", "LGW", "BCN", "MAN", "BOM",
  "DEL", "ZRH", "SVO", "DME", "JNB", "ARN", "OSL", "CPH", "HEL", "VIE"
];

```
### Caching

Responses for trip searches are cached in Redis for improved performance, reducing the need for repeated requests to external APIs.

## Project Structure

The project follows a structured folder layout to separate configurations, routes, and core business logic

  ```bash
  src/
  ├── config/                 # Configuration files for database, environment, Swagger, and Redis
  │   ├── config.ts
  │   ├── database.ts
  │   ├── jest.config.ts
  │   ├── redisClient.ts
  │   └── swaggerConfig.ts
  ├── controllers/            # Controllers for handling API requests
  │   ├── searchTrips/
  │   │   ├── searchTripsController.test.ts
  │   │   └── searchTripsController.ts
  │   └── trips/
  │       ├── deleteTripController.test.ts
  │       ├── deleteTripController.ts
  │       ├── listTripController.test.ts
  │       ├── listTripsController.ts
  │       ├── saveTripController.test.ts
  │       └── saveTripController.ts
  ├── docs/                   # Swagger documentation files
  │   ├── deleteTripDocs.ts
  │   ├── getTripDocs.ts
  │   ├── tripDocs.ts
  │   └── tripsDoc.ts
  ├── errors/                 # Custom error classes
  │   ├── AppError.ts
  │   ├── ExternalApiError.ts
  │   ├── handleError.ts
  │   ├── index.ts
  │   ├── NotFoundError.ts
  │   └── ValidationError.ts
  ├── middleware/             # Middleware for caching, validation, and error handling
  │   ├── cacheMiddleware.ts
  │   ├── errorHandler.ts
  │   └── validate.ts
  ├── models/                 # MongoDB models for data persistence
  │   └── Trip.ts
  ├── routes/                 # Route files for API endpoints
  │   ├── index.ts
  │   ├── searchTrips.routes.ts
  │   └── trips.routes.ts
  ├── services/               # Business logic and third-party API interactions
  │   ├── tripsService.test.ts
  │   └── tripsService.ts
  ├── types/                  # Type definitions
  │   └── trip.ts
  ├── utils/                  # Utility functions and constants
  │   ├── airportCodes.ts
  │   ├── constants.ts
  │   ├── logger.ts
  │   └── swaggerSetup.ts
  ├── validators/             # Validation schemas
  │   └── schemas.ts
  └── app.ts                  # Main application file, initializes routes and middleware

  ```

## Troubleshooting
- **Docker Issues:** Ensure Docker is installed and running, and check that the `.env`file contains all required variables.
  
- **Port Conflicts:** If port 3000 is already in use, change the PORT value in the .env file and rebuild the containers with docker-compose up --build.
  
- **Database Connection Errors:** Ensure that the `MONGODB_URI` in the `.env` file matches the expected format for the MongoDB container (e.g., `mongodb://root:password@mongo:27017/trip?authSource=admin`). Docker should handle network connections between services automatically, but if you encounter issues, verify that the MongoDB service is running and accessible within the Docker network.
  
- **Logging Information:** Logs are available at `logs/error.log` for error-level logs. Console logs provide additional information for successful operations.


## Compromises or Assumptions 

1. **API Rate Limits and Error Handling:** This API relies on a third-party API to retrieve trip data. Since details about rate limits or potential downtime weren’t provided, the solution assumes the external API will be reliably available. However, the implementation includes error handling via the `ExternalApiError` class to manage cases where the external API may be down or unresponsive.

2. **Validation of Query and Body Parameters:** Parameter validation is handled using Joi in the middleware to ensure the required parameters (`origin`, `destination`, and `sort_by`) are correctly formatted. The assumption here is that invalid or missing parameters should immediately return a 400 status without making a request to the third-party API.

3. **Sorting Assumptions:** The sorting is handled in a backend service acting as a client of the third-party API. In this case, the backend service retrieves the trips from the external API, sorts them in memory, and then sends the sorted results to the frontend.

4. **MongoDB Storage:**  `MongoDB` is used to persist trip data, supporting features like saving, listing, and deleting trips. To optimize query performance, compound indexes have been added. Specifically, an index on { origin: 1, destination: 1, cost: 1 } improves retrieval efficiency for "cheapest" trip queries, and another on { origin: 1, destination: 1, duration: 1 } optimizes "fastest" trip queries. These additions enhance data retrieval speed while maintaining a lightweight persistence layer suitable for the anticipated data volume.

5. **Testing and Mocking:** `Jest` is used to mock services, including the third-party API. This approach provides flexibility in testing without relying on the external API’s availability. 

6. **Environment Variable Security:** Sensitive data such as API keys and database URIs are handled through environment variables. The `.env` file should be secured appropriately and never included in version control to protect these values.
