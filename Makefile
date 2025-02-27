up:
	docker compose -f docker/docker-compose.local.yml up -d --build

down:
	docker compose -f docker/docker-compose.local.yml down

logs:
	docker compose -f docker/docker-compose.local.yml logs -f


bnr-api:
	docker build -f apps/api/docker/Dockerfile -t cathub/api --network host .
	docker run --network host cathub/api

bnr-app:
	docker build -f apps/app/docker/Dockerfile -t cathub/app --network host .
	docker run --network host cathub/app


