
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Circle, 
  Clock, 
  BookOpen, 
  FileText, 
  DollarSign,
  Plane,
  GraduationCap,
  RefreshCw
} from 'lucide-react';
import { toast } from "@/hooks/use-toast";

const RoadmapGenerator = ({ user }) => {
  const [roadmapData, setRoadmapData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [completedSteps, setCompletedSteps] = useState(new Set());

  // Generate personalized roadmap based on user profile
  const generateRoadmap = () => {
    setIsGenerating(true);
    
    // Simulate AI-powered roadmap generation
    setTimeout(() => {
      const roadmap = createPersonalizedRoadmap(user);
      setRoadmapData(roadmap);
      setIsGenerating(false);
      toast({
        title: "Roadmap Generated!",
        description: "Your personalized study abroad plan is ready",
      });
    }, 2000);
  };

  const createPersonalizedRoadmap = (userProfile) => {
    const baseTimeline = {
      immediate: [],
      shortTerm: [],
      mediumTerm: [],
      longTerm: []
    };

    // Customize based on user's timeline
    const isUrgent = userProfile?.timeline === 'fall-2024';
    const budget = userProfile?.budget;
    const countries = userProfile?.preferredCountries || [];
    const interests = userProfile?.academicInterests || [];

    // Immediate tasks (0-1 month)
    baseTimeline.immediate = [
      {
        id: 1,
        title: "English Proficiency Test",
        description: `${userProfile?.englishProficiency === 'advanced' ? 'Schedule IELTS/TOEFL' : 'Begin English preparation course'}`,
        category: "Language",
        priority: "high",
        icon: BookOpen,
        estimatedTime: "2-4 weeks"
      },
      {
        id: 2,
        title: "University Research",
        description: `Research top universities in ${countries.slice(0, 2).join(' and ')} for ${interests[0]}`,
        category: "Research",
        priority: "high",
        icon: GraduationCap,
        estimatedTime: "1-2 weeks"
      }
    ];

    // Short-term tasks (1-3 months)
    baseTimeline.shortTerm = [
      {
        id: 3,
        title: "Statement of Purpose",
        description: "Draft and refine your SOP highlighting your academic goals",
        category: "Documentation",
        priority: "high",
        icon: FileText,
        estimatedTime: "3-4 weeks"
      },
      {
        id: 4,
        title: "Financial Planning",
        description: `Prepare financial documentation for ${budget} budget range`,
        category: "Finance",
        priority: "medium",
        icon: DollarSign,
        estimatedTime: "2-3 weeks"
      }
    ];

    // Medium-term tasks (3-6 months)
    baseTimeline.mediumTerm = [
      {
        id: 5,
        title: "University Applications",
        description: "Submit applications to selected universities",
        category: "Applications",
        priority: "high",
        icon: FileText,
        estimatedTime: "4-6 weeks"
      },
      {
        id: 6,
        title: "Visa Documentation",
        description: "Prepare and organize visa application documents",
        category: "Visa",
        priority: "medium",
        icon: Plane,
        estimatedTime: "2-3 weeks"
      }
    ];

    // Long-term tasks (6+ months)
    baseTimeline.longTerm = [
      {
        id: 7,
        title: "Visa Application",
        description: "Submit visa application after university acceptance",
        category: "Visa",
        priority: "high",
        icon: Plane,
        estimatedTime: "4-8 weeks"
      },
      {
        id: 8,
        title: "Pre-departure Preparation",
        description: "Accommodation, travel, and cultural preparation",
        category: "Preparation",
        priority: "medium",
        icon: Plane,
        estimatedTime: "4-6 weeks"
      }
    ];

    return {
      timeline: baseTimeline,
      personalizedTips: [
        `Based on your ${budget} budget, consider applying for scholarships`,
        `With ${interests.length} academic interests, you have diverse program options`,
        `Your ${userProfile?.timeline} timeline ${isUrgent ? 'requires immediate action' : 'allows for thorough preparation'}`
      ],
      totalSteps: 8,
      estimatedCompletion: isUrgent ? "6-8 months" : "10-12 months"
    };
  };

  useEffect(() => {
    if (user && !roadmapData) {
      generateRoadmap();
    }
  }, [user]);

  const toggleStepCompletion = (stepId) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(stepId)) {
      newCompleted.delete(stepId);
    } else {
      newCompleted.add(stepId);
    }
    setCompletedSteps(newCompleted);
  };

  const getCompletionPercentage = () => {
    if (!roadmapData) return 0;
    return Math.round((completedSteps.size / roadmapData.totalSteps) * 100);
  };

  const TimelineSection = ({ title, tasks, timeframe }) => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <Badge variant="outline">{timeframe}</Badge>
      </div>
      <div className="space-y-3">
        {tasks.map((task) => (
          <Card key={task.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggleStepCompletion(task.id)}
                  className="mt-1 transition-colors"
                >
                  {completedSteps.has(task.id) ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-400 hover:text-blue-600" />
                  )}
                </button>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <task.icon className="h-4 w-4 text-blue-600" />
                    <h4 className={`font-medium ${completedSteps.has(task.id) ? 'line-through text-gray-500' : ''}`}>
                      {task.title}
                    </h4>
                    <Badge variant={task.priority === 'high' ? 'destructive' : 'secondary'}>
                      {task.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {task.estimatedTime}
                    </span>
                    <span className="bg-gray-100 px-2 py-1 rounded">{task.category}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  if (isGenerating) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Generating Your Personalized Roadmap...</h3>
          <p className="text-gray-600">Analyzing your preferences and creating a custom plan</p>
        </div>
      </div>
    );
  }

  if (!roadmapData) {
    return (
      <div className="text-center py-12">
        <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Roadmap Available</h3>
        <p className="text-gray-600 mb-4">Generate your personalized study abroad roadmap</p>
        <Button onClick={generateRoadmap}>Generate Roadmap</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Your Study Abroad Roadmap</span>
            <Button variant="outline" size="sm" onClick={generateRoadmap}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Regenerate
            </Button>
          </CardTitle>
          <CardDescription>
            Personalized plan based on your preferences • {getCompletionPercentage()}% Complete
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span>{completedSteps.size} of {roadmapData.totalSteps} steps completed</span>
              <span>Est. completion: {roadmapData.estimatedCompletion}</span>
            </div>
            <Progress value={getCompletionPercentage()} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Personalized Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Personalized Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {roadmapData.personalizedTips.map((tip, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-700">{tip}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Timeline Sections */}
      <div className="space-y-8">
        <TimelineSection 
          title="Immediate Actions" 
          tasks={roadmapData.timeline.immediate} 
          timeframe="0-1 month"
        />
        <TimelineSection 
          title="Short-term Goals" 
          tasks={roadmapData.timeline.shortTerm} 
          timeframe="1-3 months"
        />
        <TimelineSection 
          title="Medium-term Objectives" 
          tasks={roadmapData.timeline.mediumTerm} 
          timeframe="3-6 months"
        />
        <TimelineSection 
          title="Long-term Planning" 
          tasks={roadmapData.timeline.longTerm} 
          timeframe="6+ months"
        />
      </div>
    </div>
  );
};

export default RoadmapGenerator;
