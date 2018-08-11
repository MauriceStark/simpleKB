CURRENT_DIRECTORY := $(shell pwd)

start-all:
	@docker-compose start

clean:
	@docker-compose stop

install:
	cd $(CURRENT_DIRECTORY)/application ; npm install

build:
	@docker-compose up -d
	@docker-compose run --rm web npm install
	@docker build --tag=kb .

up:
	@docker-compose up -d
	@docker-compose logs -f web 

start:
	@docker-compose start web
	@docker-compose logs web

stop:
	@docker-compose stop web

status:
	@docker-compose ps

log:
	@docker-compose logs web

cli:
	@docker-compose run --rm web bash

mongo:
	@docker-compose run --rm mongodb bash

restart:
	@docker-compose stop web
	@docker-compose start web
	@docker-compose logs web

.PHONY: test start-all clean build start stop restart log status cli install up mongo
