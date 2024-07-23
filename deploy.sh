#!/bin/bash

echo "Pulling latest..."
git pull

echo "Building the app..."
PUBLIC_API_URL=https://hackerstheapi.com docker-compose up --build