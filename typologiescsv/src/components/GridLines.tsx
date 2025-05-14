import React from 'react';
import { GridLine } from '../types';

interface GridLinesProps {
  gridLines: GridLine[];
}

const GridLines: React.FC<GridLinesProps> = ({ gridLines }) => {
  return (
    <group>
      {gridLines.map((line) => (
        <line key={line.id}>
          <bufferGeometry attach="geometry">            <bufferAttribute
              attach="attributes-position"              args={[new Float32Array([
                line.start.x, line.start.y, 0,
                line.end.x, line.end.y, 0
              ]), 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial
            attach="material"
            color={line.direction === 'horizontal' ? 'red' : 'green'}
            linewidth={2}
          />
        </line>
      ))}
    </group>
  );
};

export default GridLines;
