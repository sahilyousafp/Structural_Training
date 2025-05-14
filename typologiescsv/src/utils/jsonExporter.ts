import { ExportData } from '../types';

/**
 * Exports the user data and floor plan to a JSON file
 */
export const exportToJSON = async (data: ExportData): Promise<{success: boolean, message: string}> => {
  // Get the curve name from the floor plan name (e.g., "curve90.csv" -> "curve90")
  const curveName = data.floorPlan.name.replace('.csv', '');
  
  // Create a filename with the format: curveName_profession_email
  let filename = curveName;
  
  // Add profession (engineerType) if available
  if (data.userCredentials?.engineerType) {
    filename = `${filename}_${data.userCredentials.engineerType}`;
  }
  
  // Add email (username) if available
  if (data.userCredentials?.username) {
    filename = `${filename}_${data.userCredentials.username}`;
  }
  
  // Add file extension
  filename = `${filename}.json`;
  // This will be determined by the server, using either the environment variable or the default path
  // Just keeping a display path for the user
  const displayOutputPath = 'D:/IaaC/TERM 3/RESEARCH/VALIDITY WEBSITE/20250514_Training R1/csv-visualizer-app/Output/';
  
  try {    // Get the API URL dynamically
    // In production, the API is on the same host/port as the client
    let apiUrl = '/api/save';
    
    // For local development, we need to use the server port
    if (window.location.hostname === 'localhost' && process.env.NODE_ENV !== 'production') {
      apiUrl = 'http://localhost:3000/api/save';
    }
    
    console.log(`Attempting to save to: ${apiUrl}`);
    
    // Send the data to the server
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data,
        filename
      })
    });
      if (!response.ok) {
      // Check the content type to determine how to handle the error
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        // If JSON response, parse it
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save file');
      } else {
        // If not JSON (likely HTML error page), use the status text
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }
    }
      const result = await response.json();
    
    // Log information about where the file was saved
    console.log(`File saved as: ${displayOutputPath}${filename}`);
    
    // Also offer the file as a download for the user to have a local copy
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
      return { 
      success: true, 
      message: `File saved successfully to ${displayOutputPath}${filename}` 
    };
  } catch (error) {
    console.error('Error saving file:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error while saving file' 
    };
  }
};

/**
 * Loads previously saved data from a JSON file
 */
export const loadFromJSON = async (file: File): Promise<ExportData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        if (event.target?.result) {
          const data = JSON.parse(event.target.result as string) as ExportData;
          resolve(data);
        } else {
          reject(new Error('No data found in file'));
        }
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading the file'));
    };
    
    reader.readAsText(file);
  });
};

