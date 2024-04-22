#!/bin/bash

# Run database migrations
echo "Running database migrations..."
flask db migrate -m "adding collections, images and users"
flask db upgrade

# Execute the main command (e.g., starting the Flask server)
echo "Starting the application..."
exec "$@"
