#!/bin/bash

echo "Pulling latest..."
git pull

echo "Building the app..."
docker compose up -d --build