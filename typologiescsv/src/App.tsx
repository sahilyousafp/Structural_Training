import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import './App.css';

import CSVVisualizer from './components/CSVVisualizer';
import ExportPanel from './components/ExportPanel';
import FeedbackDisplay from './components/FeedbackDisplay';
import LoginPage from './components/LoginPage';
import OrientationNotification from './components/OrientationNotification';
import { useCSVData } from './hooks/useCSVData';
import { useGridCalculation } from './hooks/useGridCalculation';
import { AuthProvider, useAuth } from './hooks/useAuth';
import useMediaQuery from './hooks/useMediaQuery';
import { CSVData, UserCredentials } from './types';

function AppContent() {
  const {
    availableFiles,
    loadedData,
    loading,
    error,
    loadCSVData,
    handleFileUpload,
    loadAvailableFiles
  } = useCSVData();

  const {
    gridLines,
    columns,
    activeTool,
    gridDirection,
    columnSize,
    addGridLine,
    addColumn,
    removeGridLine,
    removeColumn,
    clearGridLines,
    clearColumns,
    setTool,
    toggleGridDirection,
    updateColumnSize,
    undo,
    redo,
    canUndo,
    canRedo
  } = useGridCalculation();

  const { isLoggedIn, userCredentials, login, logout } = useAuth();
  
  const isMobile = useMediaQuery('(max-width: 480px)');
  const isTablet = useMediaQuery('(max-width: 768px) and (min-width: 481px)');

  const [feedback, setFeedback] = useState<{ message: string; type: 'info' | 'success' | 'warning' | 'error' } | null>(null);

  // Function to handle user login
  const handleLogin = (credentials: UserCredentials) => {
    login(credentials);
    setFeedback({
      message: `Welcome, ${credentials.username}!`,
      type: 'success'
    });
    
    // Clear feedback after 3 seconds
    setTimeout(() => {
      setFeedback(null);
    }, 3000);
  };

  // Load available CSV files when component mounts
  useEffect(() => {
    const csvDir = '/typologiescsv/possible3ds'; // This is relative to the public folder
    loadAvailableFiles(csvDir);
  }, [loadAvailableFiles]);

  // Load a random CSV file when available files are loaded
  useEffect(() => {
    if (availableFiles.length > 0 && !loadedData) {
      const randomIndex = Math.floor(Math.random() * availableFiles.length);
      const randomFile = availableFiles[randomIndex];
      loadCSVData(`/typologiescsv/possible3ds/${randomFile}`);
    }
  }, [availableFiles, loadedData, loadCSVData]);

  return (
    <AppContainer>
      <Header>
        <h1>{isMobile ? 'Floor Plan Visualizer' : 'Floor Plan Visualizer & Column Positioner'}</h1>
        {isLoggedIn && userCredentials && (
          <UserInfo>
            {isMobile ? (
              <>
                <strong>{userCredentials.username}</strong>
                <LogoutButton onClick={logout}>Logout</LogoutButton>
              </>
            ) : (
              <>
                Logged in as: <strong>{userCredentials.username}</strong> ({userCredentials.engineerType})
                <LogoutButton onClick={logout}>Logout</LogoutButton>
              </>
            )}
          </UserInfo>
        )}
      </Header>

      {/* Login overlay */}
      <LoginPage onLogin={handleLogin} isLoggedIn={isLoggedIn} />

      <ControlPanel>
        <ControlSection>
          <h3>1. Place Grid Lines & Columns</h3>
          <InfoText>
            {isMobile ? (
              <div>Floor plan: {loadedData && loadedData.id}</div>
            ) : (
              <>
                A random floor plan has been loaded for you to work with.
                {loadedData && (
                  <div>Floor plan ID: {loadedData.id}</div>
                )}
              </>
            )}
          </InfoText>
          <ControlRow>
            <ToolButton 
              active={activeTool === 'grid'} 
              onClick={() => setTool(activeTool === 'grid' ? null : 'grid')}
            >
              Grid Tool
            </ToolButton>
            
            {activeTool === 'grid' && (
              <DirectionButton 
                onClick={toggleGridDirection}
              >
                {gridDirection === 'horizontal' ? 'Horizontal' : 'Vertical'}
              </DirectionButton>
            )}
          </ControlRow>
          
          <ControlRow>
            <ToolButton 
              active={activeTool === 'column'} 
              onClick={() => setTool(activeTool === 'column' ? null : 'column')}
            >
              Column Tool
            </ToolButton>
            
            {activeTool === 'column' && (
              <label>
                Size:
                <input 
                  type="range" 
                  min="0.1" 
                  max="1" 
                  step="0.1"
                  value={columnSize}
                  onChange={(e) => updateColumnSize(parseFloat(e.target.value))}
                />
                {columnSize.toFixed(1)}
              </label>
            )}
          </ControlRow>
          
          <ControlRow>
            <ClearButton onClick={clearGridLines}>Clear Grid Lines</ClearButton>
            <ClearButton onClick={clearColumns}>Clear Columns</ClearButton>
          </ControlRow>
          
          <ControlRow>
            <UndoRedoButton onClick={undo} disabled={!canUndo}>Undo</UndoRedoButton>
            <UndoRedoButton onClick={redo} disabled={!canRedo}>Redo</UndoRedoButton>
          </ControlRow>
        </ControlSection>
      </ControlPanel>

      {feedback && (
        <FeedbackDisplay 
          message={feedback.message} 
          type={feedback.type} 
        />
      )}

      <VisualizerContainer>
        <CSVVisualizer
          data={loadedData}
          gridLines={gridLines}
          columns={columns}
          activeTool={activeTool}
          gridDirection={gridDirection}
          columnSize={columnSize}
          onAddGridLine={addGridLine}
          onAddColumn={addColumn}
        />
      </VisualizerContainer>

      <ExportPanel
        floorPlan={loadedData}
        gridLines={gridLines}
        columns={columns}
      />
      
      <Footer>
        <p>© 2025 IaaC Floor Plan Visualizer. All rights reserved.</p>
      </Footer>
      
      {/* Orientation notification for mobile devices */}
      <OrientationNotification />
    </AppContainer>
  );
}

// Wrapper component that provides the authentication context
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
  
  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const Header = styled.header`
  margin-bottom: 30px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  h1 {
    color: #2c3e50;
    margin: 0;
    font-size: 1.8rem;
    
    @media (max-width: 768px) {
      font-size: 1.4rem;
    }
    
    @media (max-width: 480px) {
      font-size: 1.2rem;
    }
  }
`;

const UserInfo = styled.div`
  margin-top: 10px;
  font-size: 0.9rem;
  color: #555;
  display: flex;
  align-items: center;
  gap: 10px;
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
    flex-direction: column;
    gap: 5px;
  }
`;

const LogoutButton = styled.button`
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 0.8rem;
  cursor: pointer;
  
  &:hover {
    background-color: #c0392b;
  }
`;

const ControlPanel = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    padding: 15px;
    gap: 15px;
  }
  
  @media (max-width: 480px) {
    padding: 10px;
    gap: 10px;
  }
`;

const ControlSection = styled.div`
  flex: 1;
  min-width: 300px;
  
  @media (max-width: 768px) {
    min-width: 250px;
    width: 100%;
  }
  
  @media (max-width: 480px) {
    min-width: 100%;
  }
  
  h3 {
    margin-top: 0;
    color: #3f51b5;
    border-bottom: 1px solid #e0e0e0;
    padding-bottom: 10px;
    
    @media (max-width: 480px) {
      font-size: 1rem;
    }
  }
`;

const ControlRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  flex-wrap: wrap;
  gap: 10px;
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
  }
  
  label {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    
    @media (max-width: 480px) {
      width: 100%;
    }
    
    select, input[type="file"] {
      margin-left: 10px;
      
      @media (max-width: 480px) {
        margin-left: 0;
        margin-top: 5px;
        width: 100%;
      }
    }
    
    input[type="range"] {
      margin: 0 10px;
      width: 100px;
      
      @media (max-width: 480px) {
        width: calc(100% - 30px);
        margin: 5px 0;
      }
    }
  }
`;

const InfoText = styled.div`
  margin: 10px 0;
  padding: 10px;
  background-color: #f0f8ff;
  border-radius: 4px;
  font-size: 14px;
  
  @media (max-width: 768px) {
    padding: 8px;
    margin: 8px 0;
  }
  
  @media (max-width: 480px) {
    padding: 6px;
    font-size: 12px;
    margin: 5px 0;
  }
`;

const ToolButton = styled.button<{ active: boolean }>`
  background-color: ${props => props.active ? '#3f51b5' : '#f0f0f0'};
  color: ${props => props.active ? 'white' : '#333'};
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px 15px;
  cursor: pointer;
  margin-right: 10px;
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  
  @media (max-width: 480px) {
    width: 100%;
    margin-right: 0;
    margin-bottom: 5px;
    padding: 10px;
  }
  
  &:hover {
    background-color: ${props => props.active ? '#303f9f' : '#e0e0e0'};
  }
`;

const DirectionButton = styled.button`
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px 15px;
  cursor: pointer;
  
  @media (max-width: 480px) {
    width: 100%;
    padding: 10px;
  }
  
  &:hover {
    background-color: #e0e0e0;
  }
`;

const ClearButton = styled.button`
  background-color: #ff5252;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 15px;
  cursor: pointer;
  margin-right: 10px;
  
  @media (max-width: 480px) {
    width: 100%;
    margin-right: 0;
    margin-bottom: 5px;
    padding: 10px;
  }
  
  &:hover {
    background-color: #ff3939;
  }
`;

const UndoRedoButton = styled.button<{ disabled: boolean }>`
  background-color: ${props => props.disabled ? '#cccccc' : '#4caf50'};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 15px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  margin-right: 10px;
  opacity: ${props => props.disabled ? 0.7 : 1};
  
  @media (max-width: 480px) {
    width: 100%;
    margin-right: 0;
    margin-bottom: 5px;
    padding: 10px;
  }
  
  &:hover {
    background-color: ${props => props.disabled ? '#cccccc' : '#45a049'};
  }
`;

const VisualizerContainer = styled.div`
  height: 500px;
  margin-bottom: 30px;
  
  @media (max-width: 768px) {
    height: 400px;
  }
  
  @media (max-width: 480px) {
    height: 350px;
  }
`;

const Footer = styled.footer`
  margin-top: 50px;
  text-align: center;
  color: #666;
  font-size: 14px;
  padding-top: 20px;
  border-top: 1px solid #eee;
  
  @media (max-width: 768px) {
    margin-top: 30px;
    padding-top: 15px;
  }
  
  @media (max-width: 480px) {
    margin-top: 20px;
    padding-top: 10px;
    font-size: 12px;
  }
`;

export default App;
