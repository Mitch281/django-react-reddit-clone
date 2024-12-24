#!/bin/sh

export NODE_ENV

# Check the value of NODE_ENV and adjust behavior
case "$NODE_ENV" in
dev)
    echo "Running in development mode"
    nginx -g "daemon off;"
    ;;
prod)
    echo "Running in production mode"
    nginx -g "daemon off;"
    ;;
*)
    echo "Unknown environment: $NODE_ENV"
    exit 1
    ;;
esac
