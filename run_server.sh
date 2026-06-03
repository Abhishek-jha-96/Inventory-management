#!/bin/bash

echo "Starting services..."

docker compose down
docker compose up -d --build