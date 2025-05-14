import Papa from 'papaparse';
import { Point, CSVData } from '../types';

/**
 * Parses a CSV file containing point coordinates.
 * The format is expected to be:
 * x,y,z
 * {0, 0, 0}
 * {1, 1, 0}
 * etc.
 */
export const parseCSVFile = async (file: File): Promise<CSVData> => {  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      complete: (results) => {
        try {
          // Skip the header row
          const rows = results.data as any[];
          const points: Point[] = [];
          
          for (const row of rows) {
            if (!row || !row[0] || typeof row[0] !== 'string') continue;
            
            // Parse the coordinates from format {x, y, z}
            const coordStr = row[0];
            const match = coordStr.match(/\{([-\d.]+),\s*([-\d.]+),\s*([-\d.]+)\}/);
            
            if (match) {
              points.push({
                x: parseFloat(match[1]),
                y: parseFloat(match[2]),
                z: parseFloat(match[3])
              });
            }
          }
          
          resolve({
            points,
            name: file.name,
            id: file.name.replace('.csv', '')
          });
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

/**
 * Loads a CSV file from a URL or local path
 */
export const loadCSVFromPath = async (path: string): Promise<CSVData> => {
  try {
    const response = await fetch(path);
    const text = await response.text();
    
    const lines = text.split('\n').slice(1); // Skip header
    const points: Point[] = [];
    
    for (const line of lines) {
      const match = line.match(/\{([-\d.]+),\s*([-\d.]+),\s*([-\d.]+)\}/);
      if (match) {
        points.push({
          x: parseFloat(match[1]),
          y: parseFloat(match[2]),
          z: parseFloat(match[3])
        });
      }
    }
    
    const fileName = path.split('/').pop() || 'unknown';
    
    return {
      points,
      name: fileName,
      id: fileName.replace('.csv', '')
    };
  } catch (error) {
    console.error('Error loading CSV:', error);
    throw error;
  }
};

/**
 * Fetches all available CSV files from a directory
 */
export const fetchAvailableCSVFiles = async (directoryPath: string): Promise<string[]> => {
  try {
    const response = await fetch(`${directoryPath}/index.json`);
    const data = await response.json();
    return data.files || [];
  } catch (error) {
    console.error('Error fetching available CSV files:', error);
    return [];
  }
};
