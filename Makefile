all: build

build:
	@if [ ! -s .env ]; then \
		cp .env.example .env; \
	fi
	@npm --silent install

start:
	docker-compose -f docker-compose.test.yml down -v --remove-orphans
	docker-compose up -d
	@npm start

test:
	docker-compose -f docker-compose.yml down -v  --remove-orphans
	docker-compose -f docker-compose.test.yml up -d
	@npm run test:cov
	docker-compose -f docker-compose.test.yml down -v --remove-orphans

lint:
	@npm run lint

clean:
	docker-compose down -v

.PHONY: all build start test lint clean
