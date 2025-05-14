import React, { useState } from 'react';
import styled from 'styled-components';
import { CSVData, GridLine, Column, AccuracyResult } from '../types';
import { exportToJSON } from '../utils/jsonExporter';
import { calculateAccuracy } from '../utils/accuracyCalculator';
import { useAuth } from '../hooks/useAuth';

interface ExportPanelProps {
  floorPlan: CSVData | null;
  gridLines: GridLine[];
  columns: Column[];
}

const ExportPanel: React.FC<ExportPanelProps> = ({ floorPlan, gridLines, columns }) => {
  const [accuracy, setAccuracy] = useState<AccuracyResult | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [placementDecisions, setPlacementDecisions] = useState<string>('');
  const { isLoggedIn, userCredentials } = useAuth();
  
  const handleExport = async () => {
    if (!floorPlan) {
      alert('Please load a floor plan first');
      return;
    }
    
    if (columns.length === 0) {
      alert('Please add at least one column before exporting');
      return;
    }
    
    if (!isLoggedIn) {
      alert('Please log in before exporting');
      return;
    }
    
    if (!placementDecisions.trim()) {
      alert('Please explain your column placement decisions before exporting');
      return;
    }
    
    setIsExporting(true);
    setExportError(null);
      try {      // Calculate accuracy - now an async function
      const accuracyResult = await calculateAccuracy(columns, floorPlan);
      setAccuracy(accuracyResult);
      
      // Export data to JSON with user credentials
      const exportResult = await exportToJSON({
        floorPlan,
        userData: { gridLines, columns, placementDecisions },
        accuracy: accuracyResult,
        userCredentials: userCredentials || undefined
      });      // Show feedback about where the file was saved
      if (exportResult.success) {
        const curveName = floorPlan.name.replace('.csv', '');
        alert(`Your work has been successfully saved to the Output directory with filename: ${curveName}_${userCredentials?.engineerType}_${userCredentials?.username}.json`);
      } else {
        throw new Error(exportResult.message || 'Unknown export error');
      }
    } catch (error) {
      console.error('Error during export:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      // Provide a more helpful message for the common HTML error
      const setDetailedError = () => {
        if (errorMessage.includes('<!DOCTYPE') || errorMessage.includes('Unexpected token')) {
          setExportError(`Export failed: Connection issue with the server. Please make sure the server is running at the correct address.`);
        } else {
          setExportError(`Export failed: ${errorMessage}`);
        }
      };
      
      setDetailedError();
      alert('An error occurred during export. See details below.');
    } finally {
      setIsExporting(false);
    }
  };
  
  return (
    <PanelContainer>
      <h3>Export Your Work</h3>
      
      <InfoRow>
        <InfoLabel>Floor Plan:</InfoLabel>
        <InfoValue>{floorPlan ? floorPlan.name : 'None selected'}</InfoValue>
      </InfoRow>
      
      <InfoRow>
        <InfoLabel>Grid Lines:</InfoLabel>
        <InfoValue>{gridLines.length}</InfoValue>
      </InfoRow>
      
      <InfoRow>
        <InfoLabel>Columns:</InfoLabel>
        <InfoValue>{columns.length}</InfoValue>
      </InfoRow>      {isLoggedIn && userCredentials ? (
        <SaveLocation>
          Your file will be saved as: [curve name]_{userCredentials.engineerType}_{userCredentials.username}.json
        </SaveLocation>
      ) : (
        <LoginReminder>Please log in to export your work</LoginReminder>
      )}
        <DecisionsContainer>
        <DecisionsLabel>Please explain your column placement decisions:</DecisionsLabel>
        <DecisionsTextArea 
          value={placementDecisions}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPlacementDecisions(e.target.value)}
          placeholder="Describe your reasoning for column positions, sizes, and any structural considerations..."
          rows={4}
          disabled={!isLoggedIn}
        />
      </DecisionsContainer>
      
      <ExportButton 
        onClick={handleExport}
        disabled={!floorPlan || columns.length === 0 || isExporting}
      >
        {isExporting ? 'Processing...' : 'Calculate Accuracy & Export'}
      </ExportButton>
      
      {exportError && (
        <ErrorContainer>
          <ErrorTitle>Export Error</ErrorTitle>
          <ErrorMessage>{exportError}</ErrorMessage>
        </ErrorContainer>
      )}
      
      {accuracy && (
        <AccuracyContainer>
          <h4>Accuracy Result</h4>
          
          <AccuracyScore>
            <ScoreValue>{accuracy.score}%</ScoreValue>
            <AccuracyFeedback>{accuracy.feedback}</AccuracyFeedback>
          </AccuracyScore>
          
          <DetailsToggle onClick={() => setShowDetails(!showDetails)}>
            {showDetails ? 'Hide Details' : 'Show Details'}
          </DetailsToggle>
          
          {showDetails && (
            <AccuracyDetails>
              {accuracy.details.split('\n').map((line, index) => (
                <DetailLine key={index}>{line}</DetailLine>
              ))}
            </AccuracyDetails>
          )}
        </AccuracyContainer>
      )}
    </PanelContainer>
  );
};

const PanelContainer = styled.div`
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    padding: 15px;
  }
  
  @media (max-width: 480px) {
    padding: 10px;
    border-radius: 4px;
  }
  
  h3 {
    @media (max-width: 480px) {
      font-size: 1.2rem;
      margin-top: 5px;
    }
  }
`;

const InfoRow = styled.div`
  display: flex;
  margin-bottom: 10px;
  
  @media (max-width: 480px) {
    margin-bottom: 8px;
    font-size: 0.9rem;
  }
`;

const InfoLabel = styled.div`
  font-weight: bold;
  min-width: 100px;
`;

const InfoValue = styled.div`
  flex: 1;
`;

const ExportButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 15px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 15px;
  transition: background-color 0.2s;
  
  @media (max-width: 768px) {
    width: 100%;
    padding: 12px;
  }
  
  @media (max-width: 480px) {
    font-size: 14px;
    margin-top: 10px;
  }
  
  &:hover {
    background-color: #0069d9;
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const AccuracyContainer = styled.div`
  margin-top: 20px;
  padding: 15px;
  background-color: white;
  border-radius: 6px;
  border: 1px solid #ddd;
  
  @media (max-width: 480px) {
    padding: 10px;
    margin-top: 15px;
    
    h4 {
      font-size: 1rem;
      margin-top: 5px;
      margin-bottom: 10px;
    }
  }
`;

const AccuracyScore = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;

const ScoreValue = styled.div`
  font-size: 28px;
  font-weight: bold;
  color: #28a745;
  margin-right: 15px;
`;

const AccuracyFeedback = styled.div`
  font-size: 16px;
`;

const DetailsToggle = styled.button`
  background-color: transparent;
  color: #007bff;
  border: 1px solid #007bff;
  border-radius: 4px;
  padding: 5px 10px;
  font-size: 14px;
  cursor: pointer;
  
  &:hover {
    background-color: #f0f7ff;
  }
`;

const AccuracyDetails = styled.div`
  margin-top: 15px;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 4px;
  font-family: monospace;
  font-size: 14px;
`;

const DetailLine = styled.div`
  margin-bottom: 5px;
`;

const SaveLocation = styled.div`
  margin-top: 10px;
  font-size: 14px;
  color: #555;
  
  @media (max-width: 480px) {
    font-size: 12px;
    word-break: break-word;
  }
`;

const LoginReminder = styled.div`
  margin-top: 10px;
  font-size: 14px;
  color: #d9534f;
`;

const ErrorContainer = styled.div`
  margin-top: 15px;
  padding: 12px;
  background-color: #fff8f8;
  border-radius: 4px;
  border: 1px solid #f5c6cb;
`;

const ErrorTitle = styled.div`
  font-weight: bold;
  color: #721c24;
  margin-bottom: 8px;
`;

const ErrorMessage = styled.div`
  color: #721c24;
  font-family: monospace;
  white-space: pre-wrap;
  word-break: break-word;
`;

const DecisionsContainer = styled.div`
  margin-top: 15px;
  margin-bottom: 15px;
`;

const DecisionsLabel = styled.div`
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
`;

const DecisionsTextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  resize: vertical;
  font-family: inherit;
  
  @media (max-width: 480px) {
    padding: 8px;
    font-size: 14px;
  }
  
  &:focus {
    outline: none;
    border-color: #80bdff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
  
  &:disabled {
    background-color: #e9ecef;
    cursor: not-allowed;
  }
`;

export default ExportPanel;
