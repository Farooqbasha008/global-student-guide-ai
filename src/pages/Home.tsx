import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Card,
  Button,
  Text,
  Flex,
  Grid,
  Badge
} from '../components/ui';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'AI-Powered Chat',
      description:
        'Get instant answers to your questions about studying abroad, visas, and more.',
      icon: '💬'
    },
    {
      title: 'Custom Roadmaps',
      description:
        'Create personalized roadmaps for your academic journey with step-by-step guidance.',
      icon: '🗺️'
    },
    {
      title: 'Profile Management',
      description:
        'Keep track of your progress and preferences in one place.',
      icon: '👤'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'International Student',
      text: 'This platform made my study abroad journey so much easier. The AI chat helped me understand visa requirements quickly.',
      country: 'United States'
    },
    {
      name: 'Mohammed Ali',
      role: 'Graduate Student',
      text: 'The roadmap feature helped me plan my entire academic journey. Highly recommended!',
      country: 'Egypt'
    },
    {
      name: 'Emma Chen',
      role: 'Exchange Student',
      text: 'The personalized guidance and support are invaluable. It feels like having a mentor by your side.',
      country: 'China'
    }
  ];

  return (
    <Container>
      {/* Hero Section */}
      <Card style={{ marginBottom: '2rem' }}>
        <Flex
          direction="column"
          align="center"
          style={{ textAlign: 'center', padding: '4rem 2rem' }}
        >
          <Text variant="h1" style={{ marginBottom: '1rem' }}>
            Your Global Student Journey Starts Here
          </Text>
          <Text
            variant="body"
            style={{ maxWidth: '600px', marginBottom: '2rem' }}
          >
            Get personalized guidance for studying abroad, visa applications, and
            academic planning with our AI-powered platform.
          </Text>
          <Flex gap="md">
            <Button
              variant="primary"
              onClick={() => navigate('/chat')}
            >
              Start Chatting
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/roadmap')}
            >
              Create Roadmap
            </Button>
          </Flex>
        </Flex>
      </Card>

      {/* Features Section */}
      <Text variant="h2" style={{ marginBottom: '2rem', textAlign: 'center' }}>
        Features
      </Text>
      <Grid columns={3} gap="lg" style={{ marginBottom: '4rem' }}>
        {features.map(feature => (
          <Card key={feature.title}>
            <Flex direction="column" align="center" gap="md">
              <Text style={{ fontSize: '3rem' }}>{feature.icon}</Text>
              <Text variant="h3">{feature.title}</Text>
              <Text style={{ textAlign: 'center' }}>{feature.description}</Text>
            </Flex>
          </Card>
        ))}
      </Grid>

      {/* Testimonials Section */}
      <Text variant="h2" style={{ marginBottom: '2rem', textAlign: 'center' }}>
        What Our Users Say
      </Text>
      <Grid columns={3} gap="lg" style={{ marginBottom: '4rem' }}>
        {testimonials.map(testimonial => (
          <Card key={testimonial.name}>
            <Flex direction="column" gap="md">
              <Text style={{ fontSize: '1.5rem' }}>"{testimonial.text}"</Text>
              <Flex direction="column" gap="xs">
                <Text variant="h3">{testimonial.name}</Text>
                <Flex gap="sm" align="center">
                  <Badge variant="info">{testimonial.role}</Badge>
                  <Text variant="caption">{testimonial.country}</Text>
                </Flex>
              </Flex>
            </Flex>
          </Card>
        ))}
      </Grid>

      {/* Call to Action */}
      <Card style={{ marginBottom: '2rem' }}>
        <Flex
          direction="column"
          align="center"
          style={{ textAlign: 'center', padding: '4rem 2rem' }}
        >
          <Text variant="h2" style={{ marginBottom: '1rem' }}>
            Ready to Start Your Journey?
          </Text>
          <Text
            variant="body"
            style={{ maxWidth: '600px', marginBottom: '2rem' }}
          >
            Join thousands of students who have successfully navigated their
            international education journey with our platform.
          </Text>
          <Button
            variant="primary"
            onClick={() => navigate('/signup')}
          >
            Get Started Now
          </Button>
        </Flex>
      </Card>
    </Container>
  );
};

export default Home; 