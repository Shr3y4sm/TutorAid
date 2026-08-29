.PHONY: dev compose-up compose-down compose-logs api-build validate

# Local backend (ts-node / nodemon) — run this from TutorAid-Backend/
dev:
	cd TutorAid-Backend && npm run dev

# Build both Docker services
api-build:
	docker compose build

# Boot the full backend (REST API + signalling) as containers
compose-up:
	docker compose up -d --build

# Stop & remove the containers
compose-down:
	docker compose down

# Stream the container logs
compose-logs:
	docker compose logs -f --tail=100

# Validate compose config without starting anything
validate:
	docker compose config -q