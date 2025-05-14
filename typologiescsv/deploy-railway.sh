#!/bin/bash
# Railway Deployment Script

# Function to check if command exists
function command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Check for Railway CLI
if ! command_exists railway; then
  echo "Railway CLI not found. Installing..."
  # Install Railway CLI
  curl -fsSL https://railway.app/install.sh | sh
fi

# Check for Docker
if ! command_exists docker; then
  echo "Docker not found. Please install Docker: https://docs.docker.com/get-docker/"
  exit 1
fi

# Verify Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "Docker is not running. Please start Docker and try again."
  exit 1
fi

# Login to Railway
echo "Logging in to Railway..."
railway login

# Create a new Railway project if not linked
if ! railway project 2>/dev/null; then
  echo "No project linked. Creating new project..."
  railway project create
  railway link
else
  echo "Using existing linked project"
fi

# Deploy to Railway
echo "Deploying to Railway..."
railway up

echo "Deployment complete! Your app should be available at the Railway-provided URL."
echo "You can find your deployment URL by running: railway domain"
