import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Button,
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
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <Card className="mb-8">
        <div className="text-center p-8">
          <h1 className="text-4xl font-bold mb-4">
            Your Global Student Journey Starts Here
          </h1>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Get personalized guidance for studying abroad, visa applications, and
            academic planning with our AI-powered platform.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              variant="default"
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
          </div>
        </div>
      </Card>

      {/* Features Section */}
      <h2 className="text-3xl font-bold text-center mb-8">
        Features
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {features.map(feature => (
          <Card key={feature.title} className="p-6">
            <div className="flex flex-col items-center gap-4">
              <span className="text-5xl">{feature.icon}</span>
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="text-center">{feature.description}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Testimonials Section */}
      <h2 className="text-3xl font-bold text-center mb-8">
        What Our Users Say
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {testimonials.map(testimonial => (
          <Card key={testimonial.name} className="p-6">
            <div className="flex flex-col gap-4">
              <p className="text-lg">"{testimonial.text}"</p>
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-semibold">{testimonial.name}</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{testimonial.role}</Badge>
                  <span className="text-sm text-gray-600">{testimonial.country}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Call to Action */}
      <Card className="mb-8">
        <div className="text-center p-8">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of students who have successfully navigated their
            international education journey with our platform.
          </p>
          <Button
            variant="default"
            onClick={() => navigate('/signup')}
          >
            Get Started Now
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Home; 