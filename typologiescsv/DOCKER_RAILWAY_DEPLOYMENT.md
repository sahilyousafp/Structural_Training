# Docker & Railway Deployment Guide

This guide provides instructions for deploying the CSV Visualizer application using Docker and Railway.app.

## Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop/) installed and running
- [Railway CLI](https://docs.railway.app/develop/cli) (optional, our scripts will install it if needed)
- Git for version control

## Local Docker Deployment

### Option 1: Using Docker Directly

1. **Build the Docker image**:
   ```powershell
   npm run docker:build
   ```

2. **Run the Docker container**:
   ```powershell
   npm run docker:run
   ```

3. **Access the application**:
   Open your browser and navigate to http://localhost:3000

4. **Stop the container**:
   ```powershell
   npm run docker:stop
   ```

### Option 2: Using Docker Compose

1. **Start the application with Docker Compose**:
   ```powershell
   docker-compose up -d
   ```

2. **Access the application**:
   Open your browser and navigate to http://localhost:3000

3. **Stop the application**:
   ```powershell
   docker-compose down
   ```

## Railway.app Deployment

### Option 1: Using Deployment Scripts

1. **Windows users**:
   ```powershell
   npm run railway:deploy
   # Or directly:
   .\deploy-railway.ps1
   ```

2. **Linux/Mac users**:
   ```bash
   chmod +x deploy-railway.sh
   ./deploy-railway.sh
   ```

3. **Get your app URL**:
   ```
   railway domain
   ```

### Option 2: Manual Deployment with Railway CLI

1. **Install Railway CLI** (if not already installed):
   ```powershell
   # Windows
   iwr https://raw.githubusercontent.com/railwayapp/cli/master/install.ps1 -useb | iex

   # macOS/Linux
   curl -fsSL https://railway.app/install.sh | sh
   ```

2. **Log in to Railway**:
   ```
   railway login
   ```

3. **Connect to your project**:
   ```
   railway link
   ```

4. **Deploy your application**:
   ```
   railway up
   ```

5. **Get your app URL**:
   ```
   railway domain
   ```

## Monitoring and Logs

- **View logs**:
  ```
  railway logs
  ```

- **Access Railway dashboard**:
  ```
  railway open
  ```

## Environment Variables

The following environment variables can be configured in Railway:

- `PORT`: The port on which the server will run (default: 3000)
- `OUTPUT_DIR`: Directory where exported JSON files will be saved (default: /app/deployment-package/output)
- `ALLOWED_ORIGINS`: CORS allowed origins (default: *)

For local development and testing, you can use the `.env` file:

```
# Development environment variables
PORT=3000
OUTPUT_DIR=/app/deployment-package/output
ALLOWED_ORIGINS=*
```

## Troubleshooting

### Build Failures

If you encounter build failures when deploying to Railway, check the following:

1. **"Failed to solve: process "/bin/sh -c npm run build" did not complete successfully"**
   - This usually indicates a compatibility issue between React and react-scripts
   - Solution: Make sure you're using react-scripts 5.0.1 or later with React 19
   - Check the `.npmrc` file includes `legacy-peer-deps=true`
   - Run `npm install --legacy-peer-deps` before deploying

2. **Memory issues during build**
   - If the build fails due to memory constraints, try increasing memory in Railway's project settings
   - Or optimize your app bundle size by removing unnecessary dependencies

3. **Permission issues**
   - Make sure your deployment scripts have execute permissions:
     ```bash
     chmod +x deploy-railway.sh
     ```

## Data Persistence

JSON files exported from the application are stored in the `/app/deployment-package/output` directory in the container. To persist this data:

1. **In Railway.app**: Add a Volume mount in the Railway dashboard
2. **For local Docker**: The docker-compose.yml already mounts a local `./deployment-package/output` directory to the container's `/app/deployment-package/output`
