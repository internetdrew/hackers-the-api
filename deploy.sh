#!/bin/bash

echo "Pulling latest..."
git pull

echo "Bringing down containers..."
docker compose down

echo "Building the app..."
docker compose up -d --build