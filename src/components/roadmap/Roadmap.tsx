import React, { useState } from 'react';
import { useRoadmaps } from '../../lib/state-management';
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

const Roadmap: React.FC = () => {
  const { roadmaps, isLoading, error, createRoadmap, updateRoadmap, deleteRoadmap } =
    useRoadmaps();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: ''
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
    try {
      await createRoadmap(formData.title, formData.description);
      setFormData({ title: '', description: '' });
      setIsCreating(false);
    } catch (error) {
      console.error('Error creating roadmap:', error);
    }
  };

  const handleStepToggle = (roadmapId: string, stepId: string) => {
    const roadmap = roadmaps.find(r => r.id === roadmapId);
    if (!roadmap) return;

    const updatedSteps = roadmap.steps.map(step =>
      step.id === stepId ? { ...step, completed: !step.completed } : step
    );

    updateRoadmap({
      ...roadmap,
      steps: updatedSteps,
      updatedAt: Date.now()
    });
  };

  const calculateProgress = (steps: Array<{ completed: boolean }>) => {
    const completed = steps.filter(step => step.completed).length;
    return Math.round((completed / steps.length) * 100);
  };

  return (
    <Container>
      <Flex direction="column" gap="lg">
        {/* Header */}
        <Flex justify="between" align="center">
          <Text variant="h2">Roadmaps</Text>
          <Button
            variant={isCreating ? 'outline' : 'primary'}
            onClick={() => setIsCreating(!isCreating)}
          >
            {isCreating ? 'Cancel' : 'Create Roadmap'}
          </Button>
        </Flex>

        {/* Create Form */}
        {isCreating && (
          <Card>
            <form onSubmit={handleSubmit}>
              <Flex direction="column" gap="md">
                <div>
                  <Text variant="caption">Title</Text>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter roadmap title"
                    required
                  />
                </div>
                <div>
                  <Text variant="caption">Description</Text>
                  <Input
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter roadmap description"
                    required
                  />
                </div>
                <Button type="submit" variant="primary" disabled={isLoading}>
                  {isLoading ? 'Creating...' : 'Create Roadmap'}
                </Button>
              </Flex>
            </form>
          </Card>
        )}

        {/* Error Message */}
        {error && (
          <Badge variant="danger" style={{ marginBottom: '1rem' }}>
            {error}
          </Badge>
        )}

        {/* Roadmaps Grid */}
        <Grid columns={2} gap="lg">
          {roadmaps.map(roadmap => (
            <Card key={roadmap.id}>
              <Flex direction="column" gap="md">
                {/* Header */}
                <Flex justify="between" align="center">
                  <Text variant="h3">{roadmap.title}</Text>
                  <Button
                    variant="outline"
                    onClick={() => deleteRoadmap(roadmap.id)}
                  >
                    Delete
                  </Button>
                </Flex>

                {/* Description */}
                <Text>{roadmap.description}</Text>

                {/* Progress */}
                <Flex align="center" gap="sm">
                  <Badge variant="info">
                    {calculateProgress(roadmap.steps)}% Complete
                  </Badge>
                  <Text variant="caption">
                    Updated {new Date(roadmap.updatedAt).toLocaleDateString()}
                  </Text>
                </Flex>

                {/* Steps */}
                <Flex direction="column" gap="sm">
                  {roadmap.steps.map(step => (
                    <Card
                      key={step.id}
                      style={{
                        backgroundColor: step.completed
                          ? 'var(--color-success)33'
                          : 'var(--color-surface)'
                      }}
                    >
                      <Flex justify="between" align="center">
                        <Flex direction="column" gap="xs">
                          <Text
                            style={{
                              textDecoration: step.completed
                                ? 'line-through'
                                : 'none',
                              opacity: step.completed ? 0.7 : 1
                            }}
                          >
                            {step.title}
                          </Text>
                          <Text variant="caption">{step.description}</Text>
                        </Flex>
                        <Button
                          variant={step.completed ? 'outline' : 'primary'}
                          onClick={() => handleStepToggle(roadmap.id, step.id)}
                        >
                          {step.completed ? 'Undo' : 'Complete'}
                        </Button>
                      </Flex>
                    </Card>
                  ))}
                </Flex>
              </Flex>
            </Card>
          ))}
        </Grid>
      </Flex>
    </Container>
  );
};

export default Roadmap; 