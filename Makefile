.PHONY: install test build run docker-build docker-up

install: ; cd User && npm ci && cd ../admin && npm ci

test: ; node tests/basic.test.js

build: ; cd User && npm run build && cd ../admin && npm run build

run: ; cd User && npm run dev

docker-build: ; docker build -t ghcr.io/skit-devops-2026/devops-24eskcs040:latest .

docker-up: ; docker compose up -d --build
