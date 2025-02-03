up:
	docker compose -f docker/docker-compose.local.yml up -d

down:
	docker compose -f docker/docker-compose.local.yml down

logs:
	docker compose -f docker/docker-compose.local.yml logs -f