import { useState, useEffect, useCallback } from 'react';
import { CSVData } from '../types';
import { loadCSVFromPath, parseCSVFile } from '../utils/csvParser';

export const useCSVData = () => {
  const [availableFiles, setAvailableFiles] = useState<string[]>([]);
  const [loadedData, setLoadedData] = useState<CSVData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load a CSV file from a URL or local path
  const loadCSVData = useCallback(async (path: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await loadCSVFromPath(path);
      setLoadedData(data);
    } catch (err) {
      console.error('Error loading CSV data:', err);
      setError('Failed to load the CSV file. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle file upload from user
  const handleFileUpload = useCallback(async (file: File) => {
    if (!file || !file.name.endsWith('.csv')) {
      setError('Please select a valid CSV file.');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const data = await parseCSVFile(file);
      setLoadedData(data);
    } catch (err) {
      console.error('Error parsing CSV file:', err);
      setError('Failed to parse the CSV file. Please make sure it is in the correct format.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load the list of available CSV files from the server
  const loadAvailableFiles = useCallback(async (directoryPath: string) => {
    try {
      // In a real app, this would fetch from an API endpoint
      // For now, we use the index.json file we created
      const response = await fetch(`${directoryPath}/index.json`);
      if (!response.ok) {
        throw new Error(`Failed to fetch available files: ${response.statusText}`);
      }
      
      const data = await response.json();
      setAvailableFiles(data.files || []);
    } catch (err) {
      console.error('Error fetching available files:', err);
      setError('Failed to load the list of available CSV files.');
      
      // Fallback to hardcoded list if there's an error
      const fallbackFiles = [
        'curve0.csv', 'curve1.csv', 'curve7.csv', 'curve10.csv', 
        'curve100.csv', 'curve199.csv', 'curve2.csv', 'curve3.csv'
      ];
      setAvailableFiles(fallbackFiles);
    }
  }, []);

  return {
    availableFiles,
    loadedData,
    loading,
    error,
    loadCSVData,
    handleFileUpload,
    loadAvailableFiles
  };
};
