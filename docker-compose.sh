#!/bin/sh

ENV = $1

case "$ENV" in
dev)
    echo "Running in development mode"
    docker-compose -f docker-compose.dev.yml up
    ;;
prod)
    echo "Running in production mode"
    docker-compose -f docker-compose.prod.yml up
    ;;
*)
    echo "Unknown environment: $ENV"
    exit 1
    ;;
esac
