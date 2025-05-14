import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

// Path to source directory with CSV files
const sourceDir = 'd:/IaaC/TERM 3/RESEARCH/TRAINING VALIDITY/typologiescsv/possible3ds';

// Path to destination directory in public folder
const destDir = 'd:/IaaC/TERM 3/RESEARCH/TRAINING VALIDITY/csv-visualizer-app/public/typologiescsv/possible3ds';

// Create destination directory if it doesn't exist
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Copy all CSV files from source to destination
fs.readdir(sourceDir, (err, files) => {
  if (err) {
    console.error('Error reading source directory:', err);
    return;
  }
  
  const csvFiles = files.filter(file => file.endsWith('.csv'));
  
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
    
    fs.copyFile(sourcePath, destPath, (err) => {
      if (err) {
        console.error(`Error copying ${file}:`, err);
      } else {
        console.log(`Copied ${file} to public folder`);
      }
    });
  });
});

console.log('CSV file service started');
