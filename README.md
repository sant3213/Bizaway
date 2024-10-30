# Trip Management API

This project is an API to manage and query trip information. It is built with Node.js, Express, and MongoDB, and uses Docker for containerization. The API provides endpoints for listing and managing trips, with Swagger documentation for easy exploration.

## Table of Contents

- [Trip Management API](#trip-management-api)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Installation](#installation)
  - [Accessing the Application](#accessing-the-application)
  - [Testing](#testing)
  - [API Documentation](#api-documentation)
  - [Usage](#usage)
    - [Trip Endpoints](#trip-endpoints)
    - [Search Endpoints](#search-endpoints)
  - [Project Structure](#project-structure)
  - [Troubleshooting](#troubleshooting)
  - [Compromises or Assumptions](#compromises-or-assumptions)

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) must be installed on your machine to run the application in containers.
- A valid API key and URL to query trips.

## Environment Variables

Create a `.env` file in the root of the project with the following variables:

```env
API_KEY=<YourAPIKEY>
TRIPS_API_URL=<APIToQueryTrips>
MONGODB_URI=mongodb://root:password@mongo:27017/trip?authSource=admin
PORT=3000
```

## Installation
Clone the repository from [https://github.com/sant3213/Bizaway.git](https://github.com/sant3213/Bizaway.git)
```bash
git clone https://github.com/sant3213/Bizaway.git
cd Bizaway
```

Make sure Docker is running.

Add the .env file as described above.

Running the Application
To build and start the application with Docker, run the following command in the root directory of the project:

```bash
docker-compose up --build
```

This will start the application, and it will be accessible at [http://localhost:3000](http://localhost:3000).

## Accessing the Application
- API: Use Postman or any HTTP client to send requests to [http://localhost:3000](http://localhost:3000).
- Swagger Documentation: Open [http://localhost:3000/api-docs](http://localhost:3000/api-docs) in your browser to view the Swagger API documentation.

## Testing
To run tests, make sure the application is up and then execute:

```bash
docker-compose up --build test up test 
```
Or you can run:
```bash
npm install
npm test
```
This will execute all unit and integration tests for the application.

After running tests, a coverage folder is generated in the project directory. To view test coverage details, open the HTML report in a browser by navigating to coverage/index.html. This report provides an overview of the coverage for each test.

## API Documentation
The API documentation is available via Swagger at [http://localhost:3000/api-docs](http://localhost:3000/api-docs). This provides detailed information on available endpoints, request/response structures, and example calls.

## Usage
1. Start the application as described above.
2. Use tools like Postman or Swagger to interact with the API.
3. Example endpoints include:
### Trip Endpoints

- `GET /trips`
  - **Description**: Retrieve all saved trips.
  - **Query Parameters**:
    - `page` (optional): Page number for pagination (e.g., `1`).
    - `limit` (optional): Number of trips per page (e.g., `10`).
  - **Response**: A paginated list of trips.

- `POST /trips`
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

- `DELETE /trips/{id}`
  - **Description**: Delete a trip by its unique ID.
  - **Path Parameter**:
    - `id` (string): The ID of the trip to delete.
  - **Response**: Confirmation of deletion or a not-found error if the ID doesn't match any trip.

### Search Endpoints

- `GET /search-trips`
  - **Description**: Search for trips based on origin, destination, and optional sorting.
  - **Query Parameters**:
    - `origin` (string, required): Origin city.
    - `destination` (string, required): Destination city.
    - `sort_by` (string, optional): Sorting criteria (`fastest` or `cheapest`).
  - **Response**: A list of trips matching the search criteria.
## Project Structure

```bash
    src/
    ├── app.ts                  # Main application file, initializes routes and middleware
    ├── config/                 # Configuration files for database, environment, and Swagger
    │   ├── config.ts
    │   ├── database.ts
    │   ├── jest.config.ts
    │   └── swaggerConfig.ts
    ├── controllers/            # Controller files handling API requests
    ├── docs/                   # Swagger documentation files
    ├── errors/                 # Custom error classes (e.g., AppError)
    ├── middleware/             # Middleware for validation and error handling
    │   ├── errorHandler.ts
    │   └── validate.ts
    ├── models/                 # MongoDB models for data persistence
    ├── routes/                 # Route files for trip and search-trip endpoints
    ├── services/               # Business logic and third-party API interactions
    ├── types/ 
    ├── utils/                  # Utility files (constants, logging setup)
    └── validators/     

```

## Troubleshooting
- **Docker Issues:** Ensure Docker is installed and running, and check that the `.env`file contains all required variables.
- **Port Conflicts:** If port 3000 is already in use, change the PORT value in the .env file and rebuild the containers with docker-compose up --build.
- **Database Connection Errors:** Ensure that the `MONGODB_URI` in the `.env` file matches the expected format for the MongoDB container (e.g., `mongodb://root:password@mongo:27017/trip?authSource=admin`). Docker should handle network connections between services automatically, but if you encounter issues, verify that the MongoDB service is running and accessible within the Docker network.
- **Logging Information:** Logs are available at logs/error.log for error-level logs. Console logs provide additional information for successful operations.


## Compromises or Assumptions 

1. **API Rate Limits and Error Handling:** This API relies on a third-party API to retrieve trip data. Since details about rate limits or potential downtime weren’t provided, the solution assumes the external API will be reliably available. However, the implementation includes error handling via the ExternalApiError class to manage cases where the external API may be down or unresponsive.

2. **Validation of Query and Body Parameters:** Parameter validation is handled using Joi in the middleware to ensure the required parameters (origin, destination, and sort_by) are correctly formatted. The assumption here is that invalid or missing parameters should immediately return a 400 status without making a request to the third-party API.

3. **Sorting Assumptions:** Sorting functionality is limited to fastest and cheapest options as specified. Trips are sorted on the client side after receiving them from the third-party API, assuming that the returned dataset is manageable in memory. For listing saved trips, pagination is implemented to allow more efficient data handling within the API.

4. **MongoDB Storage:** MongoDB is used to persist trip data for features like saving, listing, and deleting trips. While this provides a basic persistence layer, no additional indexing or optimization for performance is assumed due to the anticipated low volume of stored data.

5. **Testing and Mocking:** Jest is used to mock services, including the third-party API. This approach provides flexibility in testing without relying on the external API’s availability. 

6. **Environment Variable Security:** Sensitive data such as API keys and database URIs are handled through environment variables. The .env file should be secured appropriately and never included in version control to protect these values.