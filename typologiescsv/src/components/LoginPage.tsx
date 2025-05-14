import React, { useState } from 'react';
import styled from 'styled-components';
import { UserCredentials } from '../types';

interface LoginPageProps {
  onLogin: (credentials: UserCredentials) => void;
  isLoggedIn: boolean;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, isLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [engineerType, setEngineerType] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!username.trim()) {
      setError('Username is required');
      return;
    }
    
    if (!email.trim() || !email.includes('@')) {
      setError('Valid email is required');
      return;
    }
    
    if (!engineerType.trim()) {
      setError('Engineer type is required');
      return;
    }
    
    // Create user credentials
    const credentials: UserCredentials = {
      username: username.trim(),
      email: email.trim(),
      engineerType: engineerType.trim(),
      lastLogin: new Date().toISOString()
    };
    
    // Call the login function
    onLogin(credentials);
  };

  if (isLoggedIn) {
    return null;
  }

  return (
    <LoginOverlay>
      <LoginContainer>
        <LoginHeader>
          <h2>Login to Floor Plan Visualizer</h2>
          <p>Please enter your details to continue</p>
        </LoginHeader>
        
        <LoginForm onSubmit={handleSubmit}>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <FormGroup>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="engineerType">Type of Structural Engineer</Label>
            <Select
              id="engineerType"
              value={engineerType}
              onChange={(e) => setEngineerType(e.target.value)}
            >
              <option value="">Select your specialization</option>
              <option value="Civil">Civil Engineer</option>
              <option value="Structural">Structural Engineer</option>
              <option value="Architectural">Architectural Engineer</option>
              <option value="Building">Building Engineer</option>
              <option value="Construction">Construction Engineer</option>
              <option value="Other">Other</option>
            </Select>
          </FormGroup>
          
          <LoginButton type="submit">
            Login
          </LoginButton>
        </LoginForm>
      </LoginContainer>
    </LoginOverlay>
  );
};

const LoginOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const LoginContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 30px;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  
  @media (max-width: 768px) {
    max-width: 90%;
    padding: 25px;
  }
  
  @media (max-width: 480px) {
    max-width: 95%;
    padding: 20px 15px;
    border-radius: 4px;
  }
`;

const LoginHeader = styled.div`
  margin-bottom: 20px;
  text-align: center;
  
  h2 {
    color: #2c3e50;
    margin: 0 0 10px 0;
    
    @media (max-width: 480px) {
      font-size: 1.4rem;
    }
  }
  
  p {
    color: #7f8c8d;
    margin: 0;
    
    @media (max-width: 480px) {
      font-size: 0.9rem;
    }
  }
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
  
  @media (max-width: 480px) {
    margin-bottom: 15px;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
  color: #2c3e50;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  
  @media (max-width: 480px) {
    padding: 8px;
    font-size: 14px;
  }
  
  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  background-color: white;
  
  @media (max-width: 480px) {
    padding: 8px;
    font-size: 14px;
  }
  
  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`;

const LoginButton = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  
  @media (max-width: 480px) {
    padding: 10px;
    font-size: 14px;
  }
  
  &:hover {
    background-color: #2980b9;
  }
`;

const ErrorMessage = styled.div`
  background-color: #f8d7da;
  color: #721c24;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 20px;
  text-align: center;
`;

export default LoginPage;
