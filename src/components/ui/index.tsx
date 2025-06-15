import React from 'react';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import { useTheme } from '../../lib/state-management';

// Theme
const lightTheme = {
  colors: {
    primary: '#007AFF',
    secondary: '#5856D6',
    success: '#34C759',
    danger: '#FF3B30',
    warning: '#FF9500',
    info: '#5856D6',
    background: '#FFFFFF',
    surface: '#F2F2F7',
    text: '#000000',
    textSecondary: '#8E8E93',
    border: '#C6C6C8'
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px'
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '16px',
    full: '9999px'
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)'
  }
};

const darkTheme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    background: '#000000',
    surface: '#1C1C1E',
    text: '#FFFFFF',
    textSecondary: '#8E8E93',
    border: '#38383A'
  }
};

// Global Styles
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
    line-height: 1.5;
  }

  button {
    font-family: inherit;
  }
`;

// Styled Components
const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'outline' }>`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  ${props => {
    switch (props.variant) {
      case 'secondary':
        return `
          background-color: ${props.theme.colors.secondary};
          color: white;
          &:hover {
            background-color: ${props.theme.colors.secondary}dd;
          }
        `;
      case 'outline':
        return `
          background-color: transparent;
          border: 1px solid ${props.theme.colors.border};
          color: ${props.theme.colors.text};
          &:hover {
            background-color: ${props.theme.colors.surface};
          }
        `;
      default:
        return `
          background-color: ${props.theme.colors.primary};
          color: white;
          &:hover {
            background-color: ${props.theme.colors.primary}dd;
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Input = styled.input`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid ${props => props.theme.colors.border};
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  width: 100%;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}33;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const Card = styled.div`
  background-color: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
  box-shadow: ${props => props.theme.shadows.md};
`;

const Text = styled.p<{ variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' }>`
  ${props => {
    switch (props.variant) {
      case 'h1':
        return `
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: ${props.theme.spacing.lg};
        `;
      case 'h2':
        return `
          font-size: 2rem;
          font-weight: 600;
          margin-bottom: ${props.theme.spacing.md};
        `;
      case 'h3':
        return `
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: ${props.theme.spacing.sm};
        `;
      case 'caption':
        return `
          font-size: 0.875rem;
          color: ${props.theme.colors.textSecondary};
        `;
      default:
        return `
          font-size: 1rem;
          margin-bottom: ${props.theme.spacing.sm};
        `;
    }
  }}
`;

const Badge = styled.span<{ variant?: 'success' | 'danger' | 'warning' | 'info' }>`
  display: inline-block;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;

  ${props => {
    switch (props.variant) {
      case 'success':
        return `
          background-color: ${props.theme.colors.success}33;
          color: ${props.theme.colors.success};
        `;
      case 'danger':
        return `
          background-color: ${props.theme.colors.danger}33;
          color: ${props.theme.colors.danger};
        `;
      case 'warning':
        return `
          background-color: ${props.theme.colors.warning}33;
          color: ${props.theme.colors.warning};
        `;
      default:
        return `
          background-color: ${props.theme.colors.info}33;
          color: ${props.theme.colors.info};
        `;
    }
  }}
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.md};
`;

const Grid = styled.div<{ columns?: number; gap?: string }>`
  display: grid;
  grid-template-columns: repeat(${props => props.columns || 1}, 1fr);
  gap: ${props => props.gap || props.theme.spacing.md};
`;

const Flex = styled.div<{
  direction?: 'row' | 'column';
  justify?: 'start' | 'end' | 'center' | 'between' | 'around';
  align?: 'start' | 'end' | 'center' | 'stretch';
  gap?: string;
}>`
  display: flex;
  flex-direction: ${props => props.direction || 'row'};
  justify-content: ${props => {
    switch (props.justify) {
      case 'end':
        return 'flex-end';
      case 'center':
        return 'center';
      case 'between':
        return 'space-between';
      case 'around':
        return 'space-around';
      default:
        return 'flex-start';
    }
  }};
  align-items: ${props => {
    switch (props.align) {
      case 'end':
        return 'flex-end';
      case 'center':
        return 'center';
      case 'stretch':
        return 'stretch';
      default:
        return 'flex-start';
    }
  }};
  gap: ${props => props.gap || props.theme.spacing.md};
`;

// Theme Provider Component
export function UIProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  return (
    <ThemeProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
      <GlobalStyle />
      {children}
    </ThemeProvider>
  );
}

// Export Components
export {
  Button,
  Input,
  Card,
  Text,
  Badge,
  Container,
  Grid,
  Flex
}; 