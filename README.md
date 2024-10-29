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
  - [Troubleshooting](#troubleshooting)

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
docker exec -it <container_name> npm test
```
Or you can run:
```bash
npm install
npm test
```
This will execute all unit and integration tests for the application.

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

#### Search Endpoints

- `GET /search-trips`
  - **Description**: Search for trips based on origin, destination, and optional sorting.
  - **Query Parameters**:
    - `origin` (string, required): Origin city.
    - `destination` (string, required): Destination city.
    - `sort_by` (string, optional): Sorting criteria (`fastest` or `cheapest`).
  - **Response**: A list of trips matching the search criteria.

## Troubleshooting
- **Docker Issues:** Ensure Docker is installed and running, and check that the `.env`file contains all required variables.
- **Port Conflicts:** If port 3000 is already in use, change the PORT value in the .env file and rebuild the containers with docker-compose up --build.
- **Database Connection Errors:** Ensure that the `MONGODB_URI` in the `.env` file matches the expected format for the MongoDB container (e.g., `mongodb://root:password@mongo:27017/trip?authSource=admin`). Docker should handle network connections between services automatically, but if you encounter issues, verify that the MongoDB service is running and accessible within the Docker network.
