import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import useMediaQuery from '../hooks/useMediaQuery';

/**
 * Displays an orientation notification suggesting landscape mode on mobile devices
 */
const OrientationNotification: React.FC = () => {
  const isMobile = useMediaQuery('(max-width: 480px)');
  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);
  const [dismissed, setDismissed] = useState(false);

  // Listen for orientation changes
  useEffect(() => {
    const handleResize = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // If not mobile, or already in landscape, or notification dismissed, don't show
  if (!isMobile || !isPortrait || dismissed) {
    return null;
  }

  return (
    <NotificationContainer>
      <NotificationContent>
        <NotificationIcon>📱</NotificationIcon>
        <NotificationMessage>
          Rotate your device to landscape mode for a better visualization experience.
        </NotificationMessage>
        <DismissButton onClick={() => setDismissed(true)}>
          Dismiss
        </DismissButton>
      </NotificationContent>
    </NotificationContainer>
  );
};

const NotificationContainer = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  width: 90%;
  max-width: 400px;
`;

const NotificationContent = styled.div`
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const NotificationIcon = styled.div`
  font-size: 24px;
  margin-bottom: 8px;
  animation: rotate 2s infinite;
  
  @keyframes rotate {
    0% { transform: rotate(0deg); }
    25% { transform: rotate(90deg); }
    50% { transform: rotate(90deg); }
    75% { transform: rotate(0deg); }
    100% { transform: rotate(0deg); }
  }
`;

const NotificationMessage = styled.p`
  margin: 0 0 10px 0;
  text-align: center;
  font-size: 14px;
  line-height: 1.4;
`;

const DismissButton = styled.button`
  background-color: transparent;
  color: #90caf9;
  border: 1px solid #90caf9;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
  
  &:hover {
    background-color: rgba(144, 202, 249, 0.1);
  }
`;

export default OrientationNotification;
