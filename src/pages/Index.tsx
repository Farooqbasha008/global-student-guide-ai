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

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);

  // Simulate authentication check
  useEffect(() => {
    const authToken = localStorage.getItem('auth_token');
    const userProfile = localStorage.getItem('user_profile');
    
    if (authToken) {
      setIsAuthenticated(true);
      if (userProfile) {
        setHasProfile(true);
        setUser(JSON.parse(userProfile));
      }
    }
  }, []);

  const handleAuth = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem('auth_token', 'demo_token');
  };

  const handleProfileComplete = (profileData) => {
    setHasProfile(true);
    const updatedUser = { ...user, ...profileData };
    setUser(updatedUser);
    localStorage.setItem('user_profile', JSON.stringify(updatedUser));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setHasProfile(false);
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_profile');
  };

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
