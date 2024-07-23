#!/bin/bash

echo "Pulling latest..."
git pull

echo "Breaking down containers..."
docker compose down

echo "Building the app..."
PUBLIC_API_URL=https://hackerstheapi.com docker compose up -d --build