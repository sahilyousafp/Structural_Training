import React from 'react';
import { Column } from '../types';

interface ColumnPositionerProps {
  columns: Column[];
  size: number;
}

const ColumnPositioner: React.FC<ColumnPositionerProps> = ({ columns, size }) => {
  return (
    <group>
      {columns.map((column) => (
        <mesh
          key={column.id}
          position={[column.position.x, column.position.y, column.position.z]}
        >
          <cylinderGeometry 
            args={[
              column.size || size, 
              column.size || size, 
              0.5, 
              32
            ]} 
          />
          <meshStandardMaterial color="orange" />
        </mesh>
      ))}
    </group>
  );
};

export default ColumnPositioner;
