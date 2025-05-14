import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import styled from 'styled-components';
import { CSVData, Point, GridLine, Column } from '../types';
import * as THREE from 'three';
import { isMobile, isTablet, responsiveValue } from '../utils/responsive';

interface CSVVisualizerProps {
  data: CSVData | null;
  gridLines: GridLine[];
  columns: Column[];
  activeTool: 'grid' | 'column' | null;
  gridDirection: 'horizontal' | 'vertical';
  columnSize: number;
  onAddGridLine: (start: Point, end: Point) => void;
  onAddColumn: (position: Point) => void;
}

// Scene setup component to handle camera and controls
const SceneSetup: React.FC<{ data: CSVData | null }> = ({ data }) => {
  // Access all THREE.js objects at the component root level (only place where hooks can be called)
  const { camera, set, gl, scene } = useThree();
  
  const handleResize = () => {
    if (camera instanceof THREE.OrthographicCamera && data && data.points.length > 0) {
      // Recalculate camera settings on resize
      const aspect = window.innerWidth / window.innerHeight;
      
      // Calculate the bounding box of the floor plan
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      
      for (const point of data.points) {
        minX = Math.min(minX, point.x);
        maxX = Math.max(maxX, point.x);
        minY = Math.min(minY, point.y);
        maxY = Math.max(maxY, point.y);
      }
      
      // Set camera position to show the entire floor plan
      const width = maxX - minX;
      const height = maxY - minY;
      const centerX = (minX + maxX) / 2;
      const centerY = (minY + maxY) / 2;
      
      const maxDimension = Math.max(width, height);
      const padding = window.innerWidth < 768 ? 1.2 : 1.5; // Less padding on smaller screens
      
      camera.left = -maxDimension * padding * aspect;
      camera.right = maxDimension * padding * aspect;
      camera.top = maxDimension * padding;
      camera.bottom = -maxDimension * padding;
      camera.updateProjectionMatrix();
    }
  };

  // Set white background for the scene
  useEffect(() => {
    // Force white background on scene and renderer
    gl.setClearColor('#ffffff', 1);
    scene.background = new THREE.Color('#ffffff');
    
    return () => {};
  }, [gl, scene]);
  
  useEffect(() => {    // Force orthographic camera for true 2D plan view
    if (!(camera instanceof THREE.OrthographicCamera)) {
      const aspect = window.innerWidth / window.innerHeight;
      const orthoCam = new THREE.OrthographicCamera(
        -10 * aspect, 10 * aspect, 10, -10, 0.1, 1000
      );
      orthoCam.position.set(0, 10, 0); // Position camera along Y axis
      orthoCam.lookAt(0, 0, 0);
      orthoCam.up.set(0, 0, 1); // Z-up orientation for XZ plane
      set({ camera: orthoCam });
    }

    if (data && data.points.length > 0) {
      // Calculate the bounding box of the floor plan
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      
      for (const point of data.points) {
        minX = Math.min(minX, point.x);
        maxX = Math.max(maxX, point.x);
        minY = Math.min(minY, point.y);
        maxY = Math.max(maxY, point.y);
      }
      
      // Set camera position to show the entire floor plan
      const width = maxX - minX;
      const height = maxY - minY;
      const centerX = (minX + maxX) / 2;
      const centerY = (minY + maxY) / 2;
        const maxDimension = Math.max(width, height);
      const padding = responsiveValue(1.2, 1.3, 1.5); // Responsive padding based on screen size
      
      if (camera instanceof THREE.OrthographicCamera) {
        const aspect = window.innerWidth / window.innerHeight;
        camera.left = -maxDimension * padding * aspect;
        camera.right = maxDimension * padding * aspect;
        camera.top = maxDimension * padding;
        camera.bottom = -maxDimension * padding;        // Position camera to look along the Y axis for plan view
        camera.position.set(centerX, 20, centerY);
        camera.lookAt(centerX, 0, centerY);
        camera.up.set(0, 0, 1); // Set up vector to Z-axis for XZ plane orientation
        camera.updateProjectionMatrix();
      }
    }
    
    // Add resize listener for responsive adjustments
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };  }, [data, camera, set]);
    
  return (
    <>      
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 10, 0]} intensity={0.8} />      <OrbitControls
        enablePan 
        enableZoom 
        enableRotate={false}
        // Lock rotation to maintain plan view along Y-axis
        maxPolarAngle={Math.PI/2}
        minPolarAngle={Math.PI/2}
        maxAzimuthAngle={0}
        minAzimuthAngle={0}
        enableDamping={false}
        // Touch-specific options
        touches={{
          ONE: THREE.TOUCH.PAN,
          TWO: THREE.TOUCH.DOLLY_PAN
        }}
        // Improve touch sensitivity
        panSpeed={isMobile() ? 0.7 : 1}
        zoomSpeed={isMobile() ? 0.8 : 1}
      />
    </>
  );
};

// Floor plan component that renders the CSV data
const FloorPlan: React.FC<{ data: CSVData }> = ({ data }) => {
  const points = data.points;
  const hasEnoughPoints = points && points.length >= 3;
    // Create arrays for line positions
  const linePositions = useMemo(() => {
    if (!hasEnoughPoints) {
      return [];
    }
    
    const positions = [];
    
    for (let i = 0; i < points.length; i++) {      const currentPoint = points[i];
      const nextPoint = points[(i + 1) % points.length];
      // Position on the XZ plane
      positions.push(currentPoint.x, 0, currentPoint.y);
      positions.push(nextPoint.x, 0, nextPoint.y);
    }
      return positions;
  }, [points, hasEnoughPoints]);
  
  if (!hasEnoughPoints) {
    return null;
  }
  
  return (
    <group>
      <group>
        {linePositions.length > 0 && (            <line>            
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[new Float32Array(linePositions), 3]}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#000080" linewidth={2} />
          </line>
        )}
      </group>
        {/* Add points markers at each vertex */}        {points.map((point, index) => (          <mesh key={index} position={[point.x, 0, point.y]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="#000080" />
        </mesh>
      ))}
    </group>
  );
};

// Grid lines component
const GridLinesMesh: React.FC<{ gridLines: GridLine[] }> = ({ gridLines }) => {
  return (
    <group>
      {gridLines.map((line) => (
        <line key={line.id}>          
          <bufferGeometry>            
            <bufferAttribute
              attach="attributes-position"                args={[new Float32Array([
                line.start.x, 0, line.start.y, // Use XZ plane coordinates
                line.end.x, 0, line.end.y      // Use XZ plane coordinates
              ]), 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color={line.direction === 'horizontal' ? '#990000' : '#004400'}
            linewidth={2}
          />
        </line>
      ))}
    </group>
  );
};

// Column component
const ColumnsMesh: React.FC<{ columns: Column[], size: number }> = ({ columns, size }) => {
  return (    <group>      {columns.map((column) => (
        <mesh
          key={column.id}
          position={[column.position.x, 0, column.position.y]} // Use XZ plane coordinates
        >
          <cylinderGeometry 
            args={[
              column.size || size, 
              column.size || size, 
              0.05, // Height
              32
            ]} 
          />
          <meshStandardMaterial color="orange" />
        </mesh>
      ))}
    </group>
  );
};

// Dimensions component to show lengths of each side of the geometry
const DimensionsMesh: React.FC<{ data: CSVData }> = ({ data }) => {
  const points = data.points;
  const hasEnoughPoints = points && points.length >= 3;
  
  if (!hasEnoughPoints) {
    return null;
  }
  
  return (
    <group>
      {points.map((point, index) => {
        const nextIndex = (index + 1) % points.length;
        const nextPoint = points[nextIndex];
        
        // Calculate midpoint of the line segment for label placement
        const midX = (point.x + nextPoint.x) / 2;
        const midY = (point.y + nextPoint.y) / 2;
        
        // Calculate length of the line segment
        const length = Math.sqrt(
          Math.pow(nextPoint.x - point.x, 2) + 
          Math.pow(nextPoint.y - point.y, 2)
        ).toFixed(2);
        
        // Calculate angle for offset to place text outside the shape
        const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x);
        const perpAngle = angle + Math.PI/2;
        const offset = 0.5; // Distance to offset the label
        
        // Position with offset perpendicular to the line
        const labelX = midX + offset * Math.cos(perpAngle);
        const labelY = midY + offset * Math.sin(perpAngle);
        
        return (
          <group key={`dimension-${index}`}>            {/* Small markers at each end of the dimension line */}
            <mesh position={[point.x, 0.1, point.y]}>
              <sphereGeometry args={[0.1, 8, 8]} />
              <meshStandardMaterial color="gray" />
            </mesh>
            <mesh position={[nextPoint.x, 0.1, nextPoint.y]}>
              <sphereGeometry args={[0.1, 8, 8]} />
              <meshStandardMaterial color="gray" />
            </mesh>
            
            {/* Dimension line */}
            <line>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"                  args={[new Float32Array([
                    point.x, 0.1, point.y,
                    nextPoint.x, 0.1, nextPoint.y
                  ]), 3]}
                />
              </bufferGeometry>
              <lineBasicMaterial color="gray" transparent opacity={0.6} linewidth={1} />
            </line>
              {/* Dimension label */}            <group position={[labelX, 0.1, labelY]}>
              <mesh>
                <circleGeometry args={[0.3, 32]} />
                <meshBasicMaterial color="white" transparent opacity={0.7} />
              </mesh>              <Text
                position={[0, 0.05, 0]}
                color="black"
                fontSize={responsiveValue(0.2, 0.25, 0.3)}
                anchorX="center"
                anchorY="middle"
                rotation={[Math.PI/2, 0, 0]} // Rotate text to face up in XZ plane
              >
                {length}
              </Text>
            </group>
          </group>
        );
      })}
    </group>
  );
};

// Grid tracer component to show the line being drawn
const GridTracer: React.FC<{
  startPoint: Point | null;
  currentPosition: Point | null;
  gridDirection: 'horizontal' | 'vertical';
}> = ({ startPoint, currentPosition, gridDirection }) => {
  if (!startPoint || !currentPosition) return null;
  
  // Create a proper line based on the grid direction
  let end = { ...currentPosition };
  
  if (gridDirection === 'horizontal') {
    // For horizontal lines, keep the y-coordinate the same
    end.y = startPoint.y;
  } else {
    // For vertical lines, keep the x-coordinate the same
    end.x = startPoint.x;
  }
    return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"            args={[new Float32Array([
            startPoint.x, 0, startPoint.y, // Use XZ plane coordinates
            end.x, 0, end.y                // Use XZ plane coordinates
          ]), 3]}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#000080" opacity={0.7} transparent={true} linewidth={2} />
    </line>
  );
};

// Interaction plane for capturing mouse events
const InteractionPlane: React.FC<{
  activeTool: 'grid' | 'column' | null;
  gridDirection: 'horizontal' | 'vertical';
  onAddGridLine: (start: Point, end: Point) => void;
  onAddColumn: (position: Point) => void;
}> = ({ activeTool, gridDirection, onAddGridLine, onAddColumn }) => {
  const { camera, raycaster, mouse } = useThree();
  const planeRef = useRef<THREE.Mesh>(null);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [currentPosition, setCurrentPosition] = useState<Point | null>(null);
  
  // Handle mouse down event
  const handleMouseDown = (event: THREE.Event) => {
    if (!activeTool || !planeRef.current) return;
    
    // Handle touch events with type safety
    const eventObject = event as Record<string, any>;
    
    // Only try to handle touch behavior if it appears to be a touch event
    if (
      eventObject.touches || 
      (eventObject.originalEvent && eventObject.originalEvent.touches) || 
      (eventObject.pointerType === 'touch')
    ) {
      // Use cancelBubble instead of stopPropagation for better compatibility
      eventObject.cancelBubble = true;
    }
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(planeRef.current);
    
    if (intersects.length > 0) {
      const point = intersects[0].point;
      // In THREE.js, we'll use XZ plane for our 2D coordinates
      if (activeTool === 'grid') {
        setStartPoint({ x: point.x, y: point.z, z: 0 });
        setCurrentPosition({ x: point.x, y: point.z, z: 0 });
      } else if (activeTool === 'column') {
        onAddColumn({ x: point.x, y: point.z, z: 0 });
      }
    }
  };
  
  // Handle mouse up event
  const handleMouseUp = () => {
    if (activeTool !== 'grid' || !startPoint || !planeRef.current) return;
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(planeRef.current);
    
    if (intersects.length > 0) {
      const point = intersects[0].point;
      const endPoint = { x: point.x, y: point.z, z: 0 };
      
      // Create a proper line based on the grid direction
      let start = { ...startPoint };
      let end = { ...endPoint };
      
      if (gridDirection === 'horizontal') {
        // For horizontal lines, keep the y-coordinate the same
        end.y = start.y;
      } else {
        // For vertical lines, keep the x-coordinate the same
        end.x = start.x;
      }
      
      onAddGridLine(start, end);
      setStartPoint(null);
      setCurrentPosition(null);
    }
  };
  
  // Handle mouse move event
  const handleMouseMove = (event: THREE.Event) => {
    if (activeTool !== 'grid' || !startPoint || !planeRef.current) return;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(planeRef.current);

    if (intersects.length > 0) {
      const point = intersects[0].point;
      let newPosition = { x: point.x, y: point.z, z: 0 };
      
      // Constrain movement based on grid direction
      if (gridDirection === 'horizontal') {
        // For horizontal lines, keep the y-coordinate the same as start point
        newPosition.y = startPoint.y;
      } else {
        // For vertical lines, keep the x-coordinate the same as start point
        newPosition.x = startPoint.x;
      }
      
      setCurrentPosition(newPosition);
    }
  };
  
  // Transparent plane for interaction
  return (
    <mesh
      ref={planeRef}
      position={[0, 0, 0]}
      rotation={[-Math.PI/2, 0, 0]} // Rotate to lie flat on XZ plane
      onPointerDown={handleMouseDown}
      onPointerUp={handleMouseUp}
      onPointerMove={handleMouseMove}
    >
      <planeGeometry args={[1000, 1000]} /> {/* Make the plane large enough to cover the entire view */}
      <meshBasicMaterial transparent opacity={0.0} side={THREE.DoubleSide} />
      <GridTracer startPoint={startPoint} currentPosition={currentPosition} gridDirection={gridDirection} />
    </mesh>  );
};

const VisualizerContainer = styled.div`
  width: 100%;
  height: 100%;
  min-height: 500px;
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  
  @media (max-width: 768px) {
    min-height: 400px;
  }
  
  @media (max-width: 480px) {
    min-height: 350px;
    border-radius: 4px;
  }
  
  p {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    margin: 0;
    font-size: 16px;
    color: #666;
    
    @media (max-width: 480px) {
      font-size: 14px;
    }
  }
`;

const CSVVisualizer: React.FC<CSVVisualizerProps> = ({
  data,
  gridLines,
  columns,
  activeTool,
  gridDirection,
  columnSize,
  onAddGridLine,
  onAddColumn
}) => {  
  if (!data) {
    return (
      <VisualizerContainer style={{ background: '#ffffff' }}>
        <p>Loading random floor plan...</p>
      </VisualizerContainer>
    );
  }
  
  return (
    <VisualizerContainer style={{ background: '#ffffff' }}>
      <Canvas 
        style={{ background: '#ffffff' }}
        orthographic
        camera={{ 
          position: [0, 10, 0], 
          zoom: 10,
          up: [0, 0, 1] // Z-up orientation for XZ plane
        }}
        // Optimize performance based on device
        frameloop={isMobile() ? "demand" : "always"}
        dpr={Math.min(2, window.devicePixelRatio)} // Limit DPR for better performance
        gl={{ 
          antialias: !isMobile(), // Disable antialiasing on mobile for performance
          alpha: false, // Improves performance
          powerPreference: "high-performance"
        }}
        onCreated={({ gl }) => {
          gl.setClearColor('#ffffff', 1); // Force white background
        }}
      >
        <SceneSetup data={data} />
        {data && <FloorPlan data={data} />}
        {data && <DimensionsMesh data={data} />}
        <GridLinesMesh gridLines={gridLines} />
        <ColumnsMesh columns={columns} size={columnSize} />
        
        <InteractionPlane
          activeTool={activeTool}
          gridDirection={gridDirection}
          onAddGridLine={onAddGridLine}
          onAddColumn={onAddColumn}
        />
      </Canvas>
    </VisualizerContainer>
  );
};

export default CSVVisualizer;
