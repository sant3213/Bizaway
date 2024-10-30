# Run the main application in dev or prod profile
up-dev:
	docker-compose --profile dev up --build

up-prod:
	docker-compose --profile prod up --build

# Run the tests using the test profile
test:
	docker-compose -f docker-compose.yml -f docker-compose.test.yml --profile test up --build test

# Clean up all running containers and networks
down:
	docker-compose down
