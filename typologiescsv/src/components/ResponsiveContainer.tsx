import React from 'react';
import styled from 'styled-components';
import { BREAKPOINTS } from '../utils/responsive';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: number | string;
  padding?: string;
  mobilePadding?: string;
  tabletPadding?: string;
  centerContent?: boolean;
}

/**
 * A container component that automatically adjusts its styling based on screen size
 */
const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className,
  maxWidth = '1200px',
  padding = '20px',
  mobilePadding = '10px',
  tabletPadding = '15px',
  centerContent = false
}) => {
  return (
    <Container 
      className={className}
      $maxWidth={maxWidth}
      $padding={padding}
      $mobilePadding={mobilePadding}
      $tabletPadding={tabletPadding}
      $centerContent={centerContent}
    >
      {children}
    </Container>
  );
};

// Using $ prefix for transient props to prevent them from being passed to the DOM
interface ContainerProps {
  $maxWidth: number | string;
  $padding: string;
  $mobilePadding: string;
  $tabletPadding: string;
  $centerContent: boolean;
}

const Container = styled.div<ContainerProps>`
  width: 100%;
  max-width: ${props => typeof props.$maxWidth === 'number' ? `${props.$maxWidth}px` : props.$maxWidth};
  margin: 0 auto;
  padding: ${props => props.$padding};
  box-sizing: border-box;
  
  ${props => props.$centerContent && `
    display: flex;
    flex-direction: column;
    align-items: center;
  `}
  
  @media (max-width: ${BREAKPOINTS.tablet}px) {
    padding: ${props => props.$tabletPadding};
  }
  
  @media (max-width: ${BREAKPOINTS.mobile}px) {
    padding: ${props => props.$mobilePadding};
  }
`;

export default ResponsiveContainer;
