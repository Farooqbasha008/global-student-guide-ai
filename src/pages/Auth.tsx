import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/state-management';
import {
  Container,
  Card,
  Input,
  Button,
  Text,
  Flex
} from '../components/ui';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLogin && formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  return (
    <Container>
      <Flex
        direction="column"
        justify="center"
        align="center"
        style={{ minHeight: '80vh' }}
      >
        <Card style={{ width: '100%', maxWidth: '400px' }}>
          <Text variant="h2" style={{ textAlign: 'center', marginBottom: '2rem' }}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </Text>

          {error && (
            <Text
              variant="caption"
              style={{
                color: 'var(--color-danger)',
                textAlign: 'center',
                marginBottom: '1rem'
              }}
            >
              {error}
            </Text>
          )}

          <form onSubmit={handleSubmit}>
            <Flex direction="column" gap="md">
              <div>
                <Text variant="caption">Email</Text>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <Text variant="caption">Password</Text>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
              </div>

              {!isLogin && (
                <div>
                  <Text variant="caption">Confirm Password</Text>
                  <Input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                disabled={isLoading}
                style={{ marginTop: '1rem' }}
              >
                {isLoading
                  ? 'Loading...'
                  : isLogin
                  ? 'Sign In'
                  : 'Create Account'}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin
                  ? "Don't have an account? Sign Up"
                  : 'Already have an account? Sign In'}
              </Button>
            </Flex>
          </form>
        </Card>
      </Flex>
    </Container>
  );
};

export default Auth; 