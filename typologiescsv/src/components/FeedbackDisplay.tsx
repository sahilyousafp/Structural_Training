import React from 'react';
import styled from 'styled-components';

interface FeedbackDisplayProps {
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({ message, type }) => {
  return (
    <FeedbackContainer type={type}>
      <FeedbackMessage>{message}</FeedbackMessage>
    </FeedbackContainer>
  );
};

const FeedbackContainer = styled.div<{ type: 'info' | 'success' | 'warning' | 'error' }>`
  padding: 12px 20px;
  margin: 15px 0;
  border-radius: 6px;
  background-color: ${({ type }) => {
    switch (type) {
      case 'info': return '#e6f7ff';
      case 'success': return '#f6ffed';
      case 'warning': return '#fffbe6';
      case 'error': return '#fff2f0';
      default: return '#e6f7ff';
    }
  }};
  border: 1px solid ${({ type }) => {
    switch (type) {
      case 'info': return '#91caff';
      case 'success': return '#b7eb8f';
      case 'warning': return '#ffe58f';
      case 'error': return '#ffccc7';
      default: return '#91caff';
    }
  }};
  
  @media (max-width: 768px) {
    padding: 10px 15px;
    margin: 12px 0;
  }
  
  @media (max-width: 480px) {
    padding: 8px 12px;
    margin: 10px 0;
    border-radius: 4px;
  }
`;

const FeedbackMessage = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  
  @media (max-width: 480px) {
    font-size: 13px;
    line-height: 1.4;
  }
`;

export default FeedbackDisplay;
