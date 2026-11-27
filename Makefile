ENGINE ?= docker
-include .docker/local.mk

SITE_HOST ?= 0.0.0.0
SITE_PORT ?= 8080
export SITE_HOST SITE_PORT

COMPOSE = $(ENGINE) compose

.PHONY: up down logs ps
up:
	$(COMPOSE) up -d --build --force-recreate

down:
	$(COMPOSE) down

logs:
	$(COMPOSE) logs -f

ps:
	$(COMPOSE) ps
