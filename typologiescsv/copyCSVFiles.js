const fs = require('fs');
const path = require('path');

// Determine the root directory
const rootDir = __dirname;

// Path to source directory with CSV files - with fallback for different environments
let sourceDir = path.resolve(rootDir, '../typologiescsv/possible3ds'); // For local development
if (!fs.existsSync(sourceDir)) {
  sourceDir = path.resolve(rootDir, './public/typologiescsv/possible3ds'); // Try public folder
  
  // Create the directory if it doesn't exist
  if (!fs.existsSync(sourceDir)) {
    fs.mkdirSync(sourceDir, { recursive: true });
    console.log(`Created source directory: ${sourceDir}`);
  }
}

// Path to destination directory in public folder
const destDir = path.resolve(rootDir, './public/typologiescsv/possible3ds');

// Create destination directory if it doesn't exist
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Generate sample CSV files if none exist
let files = [];
let csvFiles = [];

try {
  files = fs.readdirSync(sourceDir);
  csvFiles = files.filter(file => file.endsWith('.csv'));
  
  // Copy all CSV files from source to destination
  if (csvFiles.length > 0) {
    csvFiles.forEach(file => {
      const sourcePath = path.join(sourceDir, file);
      const destPath = path.join(destDir, file);
      
      try {
        fs.copyFileSync(sourcePath, destPath);
        console.log(`Copied ${file} to public folder`);
      } catch (err) {
        console.error(`Error copying ${file}: ${err.message}`);
      }
    });
  }
} catch (err) {
  console.error(`Error reading source directory: ${err.message}`);
  
  // Create sample CSV files if no files exist
  if (!csvFiles.length) {
    const sampleData = `x,y,z\n0,0,0\n4.77921,0,0\n4.77921,-1.290478,0\n8.117291,-1.290478,0\n8.117291,0,0\n`;
    
    // Create at least one sample CSV file for testing
    fs.writeFileSync(path.join(destDir, 'sample.csv'), sampleData);
    csvFiles = ['sample.csv'];
    console.log('Created sample CSV file for testing');
  }
}

// Create an index.json file with the list of available CSV files
const indexData = {
  files: csvFiles,
  count: csvFiles.length,
  timestamp: new Date().toISOString()
};

fs.writeFileSync(
  path.join(destDir, 'index.json'),
  JSON.stringify(indexData, null, 2)
);

console.log(`Created index.json with ${csvFiles.length} CSV files`);

// Copy each CSV file
csvFiles.forEach(file => {
  const sourcePath = path.join(sourceDir, file);
  const destPath = path.join(destDir, file);
  
  fs.copyFileSync(sourcePath, destPath);
  console.log(`Copied ${file} to public folder`);
});

console.log('CSV file copy completed');
