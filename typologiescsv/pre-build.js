/**
 * Pre-build script to ensure consistent port configuration across the application
 * This script is intended to be run before building the application
 */
const fs = require('fs');
const path = require('path');

console.log('Ensuring consistent port configuration...');

// Set the single port to be used across the application
const PORT = 3000;

// Update .env file
try {  // Create .env file content
  const envContent = `# Development environment variables - this file is not committed to git
PORT=${PORT}
OUTPUT_DIR=D:/IaaC/TERM 3/RESEARCH/VALIDITY WEBSITE/20250514_Training R1/csv-visualizer-app/Output
ALLOWED_ORIGINS=http://localhost:${PORT}
`;

  fs.writeFileSync(path.join(__dirname, '.env'), envContent);
  console.log('✅ Updated .env file');
} catch (error) {
  console.error('❌ Error updating .env file:', error);
}

console.log('Port configuration complete. All services will use port 3000.');