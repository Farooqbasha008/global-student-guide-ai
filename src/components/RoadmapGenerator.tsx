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
  RefreshCw,
  Loader2
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

interface TimelineTask {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: string;
  icon: React.ElementType;
  estimatedTime: string;
}

interface RoadmapData {
  timeline: {
    shortTerm: TimelineTask[];
    mediumTerm: TimelineTask[];
    longTerm: TimelineTask[];
  };
  personalizedTips: string[];
  totalSteps: number;
  estimatedCompletion: string;
}

const RoadmapGenerator = ({ user }: { user?: User }) => {
  const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [completedSteps, setCompletedSteps] = useState(new Set<number>());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.processedProfile) {
      generateRoadmap();
    }
  }, [user?.processedProfile]);

  const generateRoadmap = () => {
    setIsGenerating(true);
    setError(null);

    try {
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
            icon: FileText,
            estimatedTime: "4-6 weeks"
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
        personalizedTips: personalizedInsights,
        totalSteps: 6,
        estimatedCompletion: "6-8 months"
      });
    } catch (error) {
      console.error('Error generating roadmap:', error);
      setError('Failed to generate roadmap. Please try again.');
      toast({
        title: "Error",
        description: "Failed to generate roadmap. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleStepCompletion = (stepId: number) => {
    setCompletedSteps(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stepId)) {
        newSet.delete(stepId);
    } else {
        newSet.add(stepId);
    }
      return newSet;
    });
  };

  const getCompletionPercentage = () => {
    if (!roadmapData) return 0;
    return Math.round((completedSteps.size / roadmapData.totalSteps) * 100);
  };

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={generateRoadmap} className="w-full">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isGenerating) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Generating Roadmap</CardTitle>
          <CardDescription>Please wait while we create your personalized roadmap...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (!roadmapData) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>No Roadmap Available</CardTitle>
          <CardDescription>Please complete your profile to generate a personalized roadmap.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const TimelineSection = ({ title, tasks, timeframe }: { title: string; tasks: TimelineTask[]; timeframe: string }) => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="space-y-4">
        {tasks.map((task: TimelineTask) => (
          <Card key={task.id} className="relative">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-4">
                <div className="mt-1">
                  {completedSteps.has(task.id) ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-300" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{task.title}</h4>
                    <Badge variant={task.priority === 'high' ? 'destructive' : 'secondary'}>
                      {task.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{task.estimatedTime}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Study Abroad Roadmap</CardTitle>
          <CardDescription>
            Personalized timeline and tasks based on your profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Progress</p>
                <p className="text-2xl font-bold">{getCompletionPercentage()}%</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={generateRoadmap}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Regenerate
              </Button>
            </div>
            <Progress value={getCompletionPercentage()} />
          </div>
        </CardContent>
      </Card>

      <ScrollArea className="h-[600px] pr-4">
        <div className="space-y-8">
          <TimelineSection
            title="Short Term (2-3 weeks)"
            tasks={roadmapData.timeline.shortTerm}
            timeframe="2-3 weeks"
          />
          <TimelineSection
            title="Medium Term (1-3 months)"
            tasks={roadmapData.timeline.mediumTerm}
            timeframe="1-3 months"
          />
          <TimelineSection
            title="Long Term (3-6 months)"
            tasks={roadmapData.timeline.longTerm}
            timeframe="3-6 months"
          />
        </div>
      </ScrollArea>

      <Card>
        <CardHeader>
          <CardTitle>Personalized Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2">
            {roadmapData.personalizedTips.map((tip, index) => (
              <li key={index} className="text-sm text-gray-600">
                {tip}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoadmapGenerator;
