import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, MessageSquare, User, Map, Globe, BookOpen, Users, Target } from 'lucide-react';
import AuthForm from '@/components/AuthForm';
import ProfileForm from '@/components/ProfileForm';
import RoadmapGenerator from '@/components/RoadmapGenerator';
import VisaChatbot from '@/components/VisaChatbot';
import Dashboard from '@/components/Dashboard';
import { toast } from "@/hooks/use-toast";

interface UserProfile {
  name?: string;
  email?: string;
  preferredCountries?: string[];
  academicInterests?: string[];
  budget?: string;
  timeline?: string;
  currentEducation?: string;
  workExperience?: string;
  englishProficiency?: string;
  novitaApiKey?: string;
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

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate authentication check
  useEffect(() => {
    try {
      const authToken = localStorage.getItem('auth_token');
      const userProfile = localStorage.getItem('user_profile');
      
      if (authToken) {
        setIsAuthenticated(true);
        if (userProfile) {
          try {
            const parsedProfile = JSON.parse(userProfile);
            setHasProfile(true);
            setUser(parsedProfile);
          } catch (error) {
            console.error('Error parsing user profile:', error);
            toast({
              title: "Error",
              description: "Failed to load your profile. Please try logging in again.",
              variant: "destructive"
            });
            handleLogout();
          }
        }
      }
    } catch (error) {
      console.error('Error during authentication check:', error);
      toast({
        title: "Error",
        description: "An error occurred while checking authentication.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleAuth = (userData: UserProfile) => {
    try {
      setIsAuthenticated(true);
      setUser(userData);
      localStorage.setItem('auth_token', 'demo_token');
    } catch (error) {
      console.error('Error during authentication:', error);
      toast({
        title: "Error",
        description: "Failed to authenticate. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleProfileComplete = (profileData: UserProfile) => {
    try {
      setHasProfile(true);
      const updatedUser = { ...user, ...profileData };
      setUser(updatedUser);
      localStorage.setItem('user_profile', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to save your profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleLogout = () => {
    try {
      setIsAuthenticated(false);
      setHasProfile(false);
      setUser(null);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_profile');
    } catch (error) {
      console.error('Error during logout:', error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-teal-600 flex items-center justify-center">
        <div className="text-center">
          <GraduationCap className="h-12 w-12 text-white animate-bounce mx-auto mb-4" />
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-teal-600 flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-fade-in">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <GraduationCap className="h-12 w-12 text-white mr-2" />
              <h1 className="text-3xl font-bold text-white">StudyMate AI</h1>
            </div>
            <p className="text-blue-100 text-lg">Your AI-powered study abroad companion</p>
          </div>
          <AuthForm onAuth={handleAuth} />
        </div>
      </div>
    );
  }

  if (!hasProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-teal-600 p-4">
        <div className="max-w-2xl mx-auto pt-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome to StudyMate AI!</h1>
            <p className="text-blue-100">Let's personalize your study abroad journey</p>
          </div>
          <ProfileForm onComplete={handleProfileComplete} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-blue-600 mr-2" />
              <h1 className="text-xl font-bold text-gray-900">StudyMate AI</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="roadmap" className="flex items-center gap-2">
              <Map className="h-4 w-4" />
              Roadmap
            </TabsTrigger>
            <TabsTrigger value="visa-chat" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Chatbot Assistant
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="animate-fade-in">
            <Dashboard user={user} />
          </TabsContent>

          <TabsContent value="roadmap" className="animate-fade-in">
            <RoadmapGenerator user={user} />
          </TabsContent>

          <TabsContent value="visa-chat" className="animate-fade-in">
            <VisaChatbot user={user} />
          </TabsContent>

          <TabsContent value="profile" className="animate-fade-in">
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Your Profile</CardTitle>
                  <CardDescription>Manage your study abroad preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <ProfileForm 
                    initialData={user} 
                    onComplete={handleProfileComplete}
                    isEdit={true}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
