#!/bin/sh

export ENV

# Check the value of NODE_ENV and adjust behavior
case "$ENV" in
dev)
    echo "Running in development mode"
    python manage.py migrate
    python manage.py seed
    python manage.py runserver 0.0.0.0:8000
    ;;
prod)
    echo "Running in production mode"
    python manage.py runserver 0.0.0.0:8000
    ;;
*)
    echo "Unknown environment: $ENV"
    exit 1
    ;;
esac
