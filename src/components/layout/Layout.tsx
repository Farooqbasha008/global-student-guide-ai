import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth, useTheme } from '../../lib/state-management';
import {
  Container,
  Flex,
  Button,
  Text,
  Card
} from '../ui';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/chat', label: 'Chat' },
    { path: '/roadmap', label: 'Roadmap' },
    { path: '/profile', label: 'Profile' }
  ];

  return (
    <Flex direction="column" style={{ minHeight: '100vh' }}>
      {/* Header */}
      <Card as="header" style={{ marginBottom: 0 }}>
        <Container>
          <Flex justify="between" align="center">
            <Text variant="h2" style={{ margin: 0 }}>
              Global Student Guide
            </Text>
            <Flex gap="md">
              {navItems.map(item => (
                <Button
                  key={item.path}
                  variant={location.pathname === item.path ? 'primary' : 'outline'}
                  onClick={() => navigate(item.path)}
                >
                  {item.label}
                </Button>
              ))}
              <Button variant="outline" onClick={toggleTheme}>
                {theme === 'light' ? '🌙' : '☀️'}
              </Button>
              {isAuthenticated ? (
                <Button variant="outline" onClick={logout}>
                  Logout
                </Button>
              ) : (
                <Button variant="primary" onClick={() => navigate('/login')}>
                  Login
                </Button>
              )}
            </Flex>
          </Flex>
        </Container>
      </Card>

      {/* Main Content */}
      <Container as="main" style={{ flex: 1 }}>
        {children}
      </Container>

      {/* Footer */}
      <Card as="footer" style={{ marginTop: 'auto' }}>
        <Container>
          <Flex justify="between" align="center">
            <Text variant="caption">
              © {new Date().getFullYear()} Global Student Guide. All rights reserved.
            </Text>
            <Flex gap="md">
              <Button variant="outline" onClick={() => navigate('/about')}>
                About
              </Button>
              <Button variant="outline" onClick={() => navigate('/contact')}>
                Contact
              </Button>
              <Button variant="outline" onClick={() => navigate('/privacy')}>
                Privacy
              </Button>
            </Flex>
          </Flex>
        </Container>
      </Card>
    </Flex>
  );
};

export default Layout; 