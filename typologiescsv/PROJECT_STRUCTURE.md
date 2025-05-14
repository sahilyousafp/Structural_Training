# CSV Visualizer Project Structure

This document outlines the folder structure and important files for the CSV Visualizer application.

## Root Directory

- `server.js` - Express server that handles API requests and serves the React app
- `package.json` - Project dependencies and scripts
- `README.md` - Project overview and documentation
- `dev-helper.ps1` - PowerShell script for development tasks
- `copyCSVFiles.js` - Script to copy CSV files to public directory
- `DEPLOYMENT_GUIDE.md` - Instructions for deployment
- `.env` - Environment variables (not committed to git)
- `.env.example` - Example environment variables

## Folders

### `/build`

Contains the compiled React application, ready to be served by the Express server.

- Static assets (CSS, JS)
- HTML files
- Media files
- CSV data files

### `/src`

Contains the React application source code:

- `App.tsx` - Main application component
- `index.tsx` - Application entry point
- `/components` - React components
- `/utils` - Utility functions including JSON export functionality
- `/hooks` - Custom React hooks
- `/types` - TypeScript type definitions

### `/public`

Static files that are served directly:

- `index.html` - HTML template for the React app
- `/typologiescsv/possible3ds` - Directory containing CSV data files

### `/Output`

Created at runtime to store JSON export files.

## Configuration

The application can be configured through environment variables:

- `PORT` - Port for the Express server (default: 3001)
- `OUTPUT_DIR` - Directory for saving exported JSON files (default: ./Output)
- `ALLOWED_ORIGINS` - CORS allowed origins (default: http://localhost:3000)

## Development Workflow

1. Use the development helper script for common tasks:
   ```
   .\dev-helper.ps1 dev    # Start development environment
   .\dev-helper.ps1 build  # Build for production
   .\dev-helper.ps1 info   # Show project information
   ```

2. Or run commands manually:
   ```
   npm run dev             # Start both client and server
   npm run start           # Start React client only
   npm run server          # Start Express server only
   ```

For detailed deployment instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md).
- `/assets` - Static assets used in development

### `/public`

Static files that will be copied to the build directory:

- `index.html` - HTML template
- `favicon.ico` - Application icon
- `/typologiescsv` - Directory containing CSV data files

## Environment Variables

The application uses these environment variables:

- `PORT` - The port to run the server on (default: 3000)
- `OUTPUT_DIR` - Directory for JSON exports (default: ./output)
- `NODE_ENV` - Application environment (development/production)

## Development Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Start development server:
   ```
   npm start
   ```

3. Build for production:
   ```
   npm run build
   ```

4. Run production server:
   ```
   node server.js
   ```
