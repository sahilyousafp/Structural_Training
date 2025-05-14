const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS || '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON bodies with reasonable limit
app.use(express.json({ limit: '5mb' }));

// Output directory for saving JSON files - use absolute path to avoid duplication
const OUTPUT_DIR = process.env.OUTPUT_DIR || path.resolve('D:/IaaC/TERM 3/RESEARCH/VALIDITY WEBSITE/20250514_Training R1/csv-visualizer-app/Output');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`Created output directory: ${OUTPUT_DIR}`);
}

// Define all API routes first
app.post('/api/save', (req, res) => {
  try {
    const { data, filename } = req.body;
    
    if (!data || !filename) {
      return res.status(400).json({ error: 'Missing data or filename' });
    }
    
    // Create the full file path
    const filePath = path.join(OUTPUT_DIR, filename);
    
    // Write the file
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    
    console.log(`File saved: ${filePath}`);
    
    return res.json({ 
      success: true, 
      message: 'File saved successfully',
      filePath
    });
  } catch (error) {
    console.error('Error saving file:', error);
    return res.status(500).json({ 
      error: 'Failed to save file', 
      details: error.message 
    });
  }
});

// API health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    outputDir: OUTPUT_DIR
  });
});

// Serve static files from the React app in production
const isProduction = process.env.NODE_ENV === 'production';
if (isProduction) {
  console.log("Running in production mode - serving static files from build directory");
  // Serve static files from the build directory
  app.use(express.static(path.join(__dirname, 'build')));
  
  // Handle React routing - must come after all API routes
  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Output directory: ${OUTPUT_DIR}`);
  console.log(`Running in ${isProduction ? 'production' : 'development'} mode`);
});

