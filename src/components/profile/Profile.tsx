import React, { useState } from 'react';
import { useAuth, useTheme } from '../../lib/state-management';
import {
  Container,
  Card,
  Input,
  Button,
  Text,
  Flex,
  Grid,
  Badge
} from '../ui';

const Profile: React.FC = () => {
  const { user, isLoading, error } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    language: user?.preferences.language || 'en',
    notifications: user?.preferences.notifications || true
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Mock update - replace with actual API call
    console.log('Updating profile:', formData);
    setIsEditing(false);
  };

  if (!user) {
    return (
      <Container>
        <Card>
          <Text>Please log in to view your profile.</Text>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      <Grid columns={2} gap="lg">
        {/* Profile Information */}
        <Card>
          <Flex direction="column" gap="lg">
            <Text variant="h2">Profile</Text>

            {error && (
              <Badge variant="danger" style={{ marginBottom: '1rem' }}>
                {error}
              </Badge>
            )}

            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <Flex direction="column" gap="md">
                  <div>
                    <Text variant="caption">Name</Text>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      required
                    />
                  </div>

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
                    <Text variant="caption">Language</Text>
                    <select
                      name="language"
                      value={formData.language}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        borderRadius: '4px',
                        border: '1px solid var(--color-border)',
                        backgroundColor: 'var(--color-background)',
                        color: 'var(--color-text)'
                      }}
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                        type="checkbox"
                        name="notifications"
                        checked={formData.notifications}
                        onChange={handleChange}
                      />
                      <Text variant="caption">Enable Notifications</Text>
                    </label>
                  </div>

                  <Flex gap="md">
                    <Button type="submit" variant="primary" disabled={isLoading}>
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                  </Flex>
                </Flex>
              </form>
            ) : (
              <Flex direction="column" gap="md">
                <div>
                  <Text variant="caption">Name</Text>
                  <Text>{user.name}</Text>
                </div>

                <div>
                  <Text variant="caption">Email</Text>
                  <Text>{user.email}</Text>
                </div>

                <div>
                  <Text variant="caption">Language</Text>
                  <Text>{user.preferences.language.toUpperCase()}</Text>
                </div>

                <div>
                  <Text variant="caption">Notifications</Text>
                  <Text>
                    {user.preferences.notifications ? 'Enabled' : 'Disabled'}
                  </Text>
                </div>

                <Button variant="primary" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              </Flex>
            )}
          </Flex>
        </Card>

        {/* Preferences */}
        <Card>
          <Flex direction="column" gap="lg">
            <Text variant="h2">Preferences</Text>

            <Flex direction="column" gap="md">
              <div>
                <Text variant="caption">Theme</Text>
                <Flex gap="md" style={{ marginTop: '0.5rem' }}>
                  <Button
                    variant={theme === 'light' ? 'primary' : 'outline'}
                    onClick={() => theme !== 'light' && toggleTheme()}
                  >
                    Light
                  </Button>
                  <Button
                    variant={theme === 'dark' ? 'primary' : 'outline'}
                    onClick={() => theme !== 'dark' && toggleTheme()}
                  >
                    Dark
                  </Button>
                </Flex>
              </div>

              <div>
                <Text variant="caption">Account Settings</Text>
                <Flex direction="column" gap="sm" style={{ marginTop: '0.5rem' }}>
                  <Button variant="outline">Change Password</Button>
                  <Button variant="outline">Export Data</Button>
                  <Button variant="outline" style={{ color: 'var(--color-danger)' }}>
                    Delete Account
                  </Button>
                </Flex>
              </div>

              <div>
                <Text variant="caption">Privacy Settings</Text>
                <Flex direction="column" gap="sm" style={{ marginTop: '0.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="checkbox" defaultChecked />
                    <Text variant="caption">Share usage data</Text>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="checkbox" defaultChecked />
                    <Text variant="caption">Show online status</Text>
                  </label>
                </Flex>
              </div>
            </Flex>
          </Flex>
        </Card>
      </Grid>
    </Container>
  );
};

export default Profile; 