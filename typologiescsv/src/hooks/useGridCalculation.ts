import { useState, useCallback, useRef, useEffect } from 'react';
import { GridLine, Point, Column } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface HistoryState {
  gridLines: GridLine[];
  columns: Column[];
}

export const useGridCalculation = () => {
  const [gridLines, setGridLines] = useState<GridLine[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [activeTool, setActiveTool] = useState<'grid' | 'column' | null>(null);
  const [gridDirection, setGridDirection] = useState<'horizontal' | 'vertical'>('horizontal');
  const [columnSize, setColumnSize] = useState<number>(0.5);
  
  // History management
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const historyRef = useRef<HistoryState[]>([]);
  const [canUndo, setCanUndo] = useState<boolean>(false);
  const [canRedo, setCanRedo] = useState<boolean>(false);

  // Add current state to history
  const addToHistory = useCallback(() => {
    // Only add to history if there are changes
    const currentState: HistoryState = {
      gridLines: [...gridLines],
      columns: [...columns]
    };
    
    // Truncate future history if we're undoing and then making a new change
    if (historyIndex < historyRef.current.length - 1) {
      historyRef.current = historyRef.current.slice(0, historyIndex + 1);
    }
    
    historyRef.current.push(currentState);
    setHistoryIndex(historyRef.current.length - 1);
    setCanUndo(true);
    setCanRedo(false);
  }, [gridLines, columns, historyIndex]);

  // Add a new grid line
  const addGridLine = useCallback((start: Point, end: Point) => {
    const newGridLine: GridLine = {
      id: uuidv4(),
      start,
      end,
      direction: gridDirection
    };
    
    setGridLines(prevLines => [...prevLines, newGridLine]);
    
    // After state update, add to history using setTimeout to ensure state is updated
    setTimeout(() => addToHistory(), 0);
  }, [gridDirection, addToHistory]);
  // Add a new column
  const addColumn = useCallback((position: Point) => {
    const newColumn: Column = {
      id: uuidv4(),
      position,
      size: columnSize
    };
    
    setColumns(prevColumns => [...prevColumns, newColumn]);
    
    // After state update, add to history
    setTimeout(() => addToHistory(), 0);
  }, [columnSize, addToHistory]);

  // Remove a grid line
  const removeGridLine = useCallback((id: string) => {
    setGridLines(prevLines => prevLines.filter(line => line.id !== id));
    
    // After state update, add to history
    setTimeout(() => addToHistory(), 0);
  }, [addToHistory]);
  // Remove a column
  const removeColumn = useCallback((id: string) => {
    setColumns(prevColumns => prevColumns.filter(column => column.id !== id));
    
    // After state update, add to history
    setTimeout(() => addToHistory(), 0);
  }, [addToHistory]);

  // Clear all grid lines
  const clearGridLines = useCallback(() => {
    setGridLines([]);
    
    // After state update, add to history
    setTimeout(() => addToHistory(), 0);
  }, [addToHistory]);
  // Clear all columns
  const clearColumns = useCallback(() => {
    setColumns([]);
    
    // After state update, add to history
    setTimeout(() => addToHistory(), 0);
  }, [addToHistory]);

  // Implement undo functionality
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const prevState = historyRef.current[newIndex];
      
      setGridLines(prevState.gridLines);
      setColumns(prevState.columns);
      setHistoryIndex(newIndex);
      setCanRedo(true);
      
      // Check if we can undo further
      setCanUndo(newIndex > 0);
    }
  }, [historyIndex]);

  // Implement redo functionality
  const redo = useCallback(() => {
    if (historyIndex < historyRef.current.length - 1) {
      const newIndex = historyIndex + 1;
      const nextState = historyRef.current[newIndex];
      
      setGridLines(nextState.gridLines);
      setColumns(nextState.columns);
      setHistoryIndex(newIndex);
      setCanUndo(true);
      
      // Check if we can redo further
      setCanRedo(newIndex < historyRef.current.length - 1);
    }
  }, [historyIndex]);

  // Set active tool
  const setTool = useCallback((tool: 'grid' | 'column' | null) => {
    setActiveTool(tool);
  }, []);

  // Toggle grid direction
  const toggleGridDirection = useCallback(() => {
    setGridDirection(prev => prev === 'horizontal' ? 'vertical' : 'horizontal');
  }, []);
  // Update column size
  const updateColumnSize = useCallback((size: number) => {
    setColumnSize(size);
  }, []);

  // Initialize history with empty state
  useEffect(() => {
    // Initialize with an empty state as the first history item
    if (historyRef.current.length === 0) {
      historyRef.current.push({
        gridLines: [],
        columns: []
      });
      setHistoryIndex(0);
    }
  }, []);

  return {
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
  };
};
