#!/bin/bash

# Wait for PostgreSQL to be available
echo "Waiting for PostgreSQL to start..."
while ! nc -z db 5432; do
	sleep 0.1
done
echo "PostgreSQL started"

# Run database migrations
echo "Running database migrations..."
flask db upgrade

# Start command specified in CMD
echo "Starting application..."
exec "$@"
