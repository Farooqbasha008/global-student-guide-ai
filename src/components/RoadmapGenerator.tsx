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
import { ScrollArea } from "@/components/ui/scroll-area";

interface User {
  name?: string;
  preferredCountries?: string[];
  academicInterests?: string[];
  budget?: string;
  timeline?: string;
  processedProfile?: {
    personalizedInsights: string[];
    recommendedUniversities: string[];
    scholarshipOpportunities: string[];
    visaRequirements: string[];
    timelineRecommendations: string[];
    budgetAnalysis: string;
    academicPath: string;
  };
}

interface RoadmapData {
  timeline: {
    shortTerm: Array<{
      id: number;
      title: string;
      description: string;
      category: string;
      priority: string;
      icon: any;
      estimatedTime: string;
    }>;
    mediumTerm: Array<{
      id: number;
      title: string;
      description: string;
      category: string;
      priority: string;
      icon: any;
      estimatedTime: string;
    }>;
    longTerm: Array<{
      id: number;
      title: string;
      description: string;
      category: string;
      priority: string;
      icon: any;
      estimatedTime: string;
    }>;
  };
  personalizedTips: string[];
  totalSteps: number;
  estimatedCompletion: string;
}

const RoadmapGenerator = ({ user }: { user?: User }) => {
  const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [completedSteps, setCompletedSteps] = useState(new Set());

  const generateRoadmap = () => {
    if (!user?.processedProfile) {
      // Fallback to basic roadmap if no processed profile
      const baseTimeline = {
        shortTerm: [
          {
            id: 1,
            title: "Research Universities",
            description: "Explore universities in your preferred countries",
            category: "Research",
            priority: "high",
            icon: GraduationCap,
            estimatedTime: "2-3 weeks"
          },
          {
            id: 2,
            title: "Prepare Documents",
            description: "Gather required academic and personal documents",
            category: "Documents",
            priority: "high",
            icon: FileText,
            estimatedTime: "1-2 weeks"
          }
        ],
        mediumTerm: [
          {
            id: 3,
            title: "University Applications",
            description: "Submit applications to selected universities",
            category: "Applications",
            priority: "high",
            icon: FileText,
            estimatedTime: "4-6 weeks"
          },
          {
            id: 4,
            title: "Visa Documentation",
            description: "Prepare and organize visa application documents",
            category: "Visa",
            priority: "medium",
            icon: FileText,
            estimatedTime: "2-3 weeks"
          }
        ],
        longTerm: [
          {
            id: 5,
            title: "Visa Application",
            description: "Submit visa application after university acceptance",
            category: "Visa",
            priority: "high",
            icon: FileText,
            estimatedTime: "4-8 weeks"
          },
          {
            id: 6,
            title: "Pre-departure Preparation",
            description: "Accommodation, travel, and cultural preparation",
            category: "Preparation",
            priority: "medium",
            icon: FileText,
            estimatedTime: "4-6 weeks"
          }
        ]
      };

      setRoadmapData({
        timeline: baseTimeline,
        personalizedTips: [
          "Consider your budget when selecting universities",
          "Research scholarship opportunities",
          "Start preparing required documents early"
        ],
        totalSteps: 6,
        estimatedCompletion: "6-8 months"
      });
      return;
    }

    // Use the processed profile data to generate a personalized roadmap
    const { 
      personalizedInsights,
      recommendedUniversities,
      scholarshipOpportunities,
      visaRequirements,
      timelineRecommendations,
      budgetAnalysis,
      academicPath
    } = user.processedProfile;

    const baseTimeline = {
      shortTerm: [
        {
          id: 1,
          title: "Research Recommended Universities",
          description: recommendedUniversities.join(", "),
          category: "Research",
          priority: "high",
          icon: GraduationCap,
          estimatedTime: "2-3 weeks"
        },
        {
          id: 2,
          title: "Prepare Required Documents",
          description: visaRequirements.join(", "),
          category: "Documents",
          priority: "high",
          icon: FileText,
          estimatedTime: "1-2 weeks"
        }
      ],
      mediumTerm: [
        {
          id: 3,
          title: "Apply for Scholarships",
          description: scholarshipOpportunities.join(", "),
          category: "Financial",
          priority: "high",
          icon: DollarSign,
          estimatedTime: "4-6 weeks"
        },
        {
          id: 4,
          title: "University Applications",
          description: "Submit applications to selected universities",
          category: "Applications",
          priority: "high",
          icon: GraduationCap,
          estimatedTime: "4-6 weeks"
        }
      ],
      longTerm: [
        {
          id: 5,
          title: "Visa Application Process",
          description: visaRequirements.join(", "),
          category: "Visa",
          priority: "high",
          icon: FileText,
          estimatedTime: "4-8 weeks"
        },
        {
          id: 6,
          title: "Academic Preparation",
          description: academicPath,
          category: "Academic",
          priority: "medium",
          icon: BookOpen,
          estimatedTime: "4-6 weeks"
        }
      ]
    };

    setRoadmapData({
      timeline: baseTimeline,
      personalizedTips: personalizedInsights,
      totalSteps: 6,
      estimatedCompletion: timelineRecommendations[0] || "6-8 months"
    });
  };

  useEffect(() => {
    if (user) {
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
      <Card>
        <CardHeader>
          <CardTitle>Your Personalized Roadmap</CardTitle>
          <CardDescription>
            A step-by-step guide to your study abroad journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Short-term Tasks */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Short-term Tasks (1-3 months)</h3>
              <div className="space-y-4">
                {roadmapData.timeline.shortTerm.map((task) => (
                  <div key={task.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <task.icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{task.title}</h4>
                        <Badge variant="secondary" className="ml-2">
                          {task.estimatedTime}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Medium-term Tasks */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Medium-term Tasks (3-6 months)</h3>
              <div className="space-y-4">
                {roadmapData.timeline.mediumTerm.map((task) => (
                  <div key={task.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <task.icon className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{task.title}</h4>
                        <Badge variant="secondary" className="ml-2">
                          {task.estimatedTime}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Long-term Tasks */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Long-term Tasks (6+ months)</h3>
              <div className="space-y-4">
                {roadmapData.timeline.longTerm.map((task) => (
                  <div key={task.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <task.icon className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{task.title}</h4>
                        <Badge variant="secondary" className="ml-2">
                          {task.estimatedTime}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Personalized Tips */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Personalized Tips</h3>
              <div className="space-y-2">
                {roadmapData.personalizedTips.map((tip, index) => (
                  <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-800">{tip}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Total Steps</h4>
                  <p className="text-2xl font-bold text-blue-600">{roadmapData.totalSteps}</p>
                </div>
                <div>
                  <h4 className="font-medium">Estimated Completion</h4>
                  <p className="text-2xl font-bold text-green-600">{roadmapData.estimatedCompletion}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoadmapGenerator;
