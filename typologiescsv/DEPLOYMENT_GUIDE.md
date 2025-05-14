# CSV Visualizer Local Development and Deployment Guide

This guide provides instructions for development, testing, and deploying the CSV Visualizer application on a local server or web hosting service.

## Quick Start with Development Helper Script

The application includes a PowerShell helper script that simplifies common development tasks:

```powershell
# Show all available commands
.\dev-helper.ps1 help

# Run development environment (React app + Express server)
.\dev-helper.ps1 dev

# Show project information
.\dev-helper.ps1 info

# Create a deployment package
.\dev-helper.ps1 deploy
```

## Manual Development Environment Setup

1. **Clone the Repository**:
   ```powershell
   git clone <repository-url>
   cd csv-visualizer-app
   ```

2. **Install Dependencies**:
   ```powershell
   npm install
   ```

3. **Copy CSV Files to Public Directory** (for development):
   ```powershell
   node copyCSVFiles.js
   ```

4. **Set Up Environment Variables**:
   - Copy `.env.example` to `.env`
   - Update values as needed

5. **Start Development Environment**:
   ```powershell
   # Start both React app and Express server
   npm run dev
   
   # Or start them separately:
   # Start React development server
   npm run start
   
   # In a separate terminal
   npm run server
   ```

   Alternatively, you can use the combined development script:
   ```powershell
   npm run dev
   ```

5. **Access the Application**:
   Open your browser and navigate to http://localhost:3000

## Building for Production

1. **Create Production Build**:
   ```powershell
   npm run build
   ```   This creates an optimized production build in the `build` directory.

2. **Test Production Build Locally**:
   ```powershell
   # After building
   npm run server
   ```

   Access the application at http://localhost:3000

## Deployment Options

### Option 1: Traditional Web Hosting

1. **Prepare for Deployment**:
   ```powershell
   npm run build
   ```

2. **Files to Upload**:
   - `build/` directory (all contents)
   - `server.js`
   - `package.json`
   - `.env` (with production settings)

3. **Server Requirements**:
   - Node.js environment (v14 or later recommended)
   - Ability to run Node.js applications
   - Set up environment variables for:
     - `PORT` - The port the server will listen on
     - `OUTPUT_DIR` - Directory for saving exported JSON files
     - `NODE_ENV=production`

4. **Installation on Server**:
   ```powershell
   npm install --production
   node server.js
   ```

### Option 2: Local Server Deployment

1. **Create a Dedicated Directory**:
   ```powershell
   mkdir -p D:\Deployment\csv-visualizer
   ```

2. **Copy Required Files**:
   ```powershell
   # Build the project first
   npm run build
   
   # Copy files to deployment directory
   Copy-Item -Path build -Destination D:\Deployment\csv-visualizer -Recurse
   Copy-Item -Path server.js -Destination D:\Deployment\csv-visualizer
   Copy-Item -Path package.json -Destination D:\Deployment\csv-visualizer
   
   # Create output directory
   New-Item -Path "D:\Deployment\csv-visualizer\output" -ItemType Directory -Force
   ```

3. **Install Dependencies in Deployment Directory**:
   ```powershell
   cd D:\Deployment\csv-visualizer
   npm install --production
   ```

4. **Start the Server**:
   ```powershell
   node server.js
   ```

## Environment Variables

The application uses the following environment variables:

- `PORT` - The port for the server (default: 3001)
- `OUTPUT_DIR` - Directory for saving exported JSON files (default: 'D:/IaaC/TERM 3/RESEARCH/TRAINING VALIDITY/Output')
- `NODE_ENV` - Environment mode ('development' or 'production')
- `ALLOWED_ORIGINS` - CORS allowed origins (default: '*')

You can set these variables in a `.env` file for development or configure them in your hosting environment for production.

## Troubleshooting

1. **Port Conflicts**:
   If you get a port in use error, change the PORT environment variable:
   ```powershell
   $env:PORT = "3002"
   node server.js
   ```

2. **File Permission Issues**:
   Ensure the application has write permissions to the OUTPUT_DIR directory.

3. **Missing CSV Files**:
   Run `node copyCSVFiles.js` to copy CSV files from the source directory to the public/build directory.

4. **Build Errors**:
   Clear the node_modules directory and package-lock.json file, then reinstall:
   ```powershell
   Remove-Item -Path node_modules -Recurse -Force
   Remove-Item -Path package-lock.json -Force
   npm install
   ```

## Additional Resources

- [Node.js Documentation](https://nodejs.org/en/docs/)
- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Three.js Documentation](https://threejs.org/docs/)
