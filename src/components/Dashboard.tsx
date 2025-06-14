
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  GraduationCap, 
  FileText, 
  DollarSign, 
  Calendar, 
  CheckCircle, 
  Clock,
  TrendingUp,
  Globe
} from 'lucide-react';

const Dashboard = ({ user }) => {
  const completionPercentage = 35;
  
  const upcomingTasks = [
    { id: 1, task: "Complete IELTS Registration", deadline: "2 weeks", priority: "high" },
    { id: 2, task: "Research Universities", deadline: "1 month", priority: "medium" },
    { id: 3, task: "Prepare SOP Draft", deadline: "3 weeks", priority: "high" },
    { id: 4, task: "Financial Documentation", deadline: "1 month", priority: "medium" }
  ];

  const quickStats = [
    { title: "Applications Ready", value: "0/5", icon: FileText, color: "text-blue-600" },
    { title: "Budget Planning", value: user?.budget || "Not Set", icon: DollarSign, color: "text-green-600" },
    { title: "Timeline", value: user?.timeline || "Not Set", icon: Calendar, color: "text-purple-600" },
    { title: "Countries", value: user?.preferredCountries?.length || 0, icon: Globe, color: "text-orange-600" }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.name}! 👋</h2>
        <p className="text-blue-100">Your study abroad journey is {completionPercentage}% complete</p>
        <Progress value={completionPercentage} className="mt-4 bg-blue-500/30" />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Upcoming Tasks
            </CardTitle>
            <CardDescription>Stay on track with your study abroad preparation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <p className="font-medium">{task.task}</p>
                  <p className="text-sm text-gray-600">Due in {task.deadline}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={task.priority === 'high' ? 'destructive' : 'secondary'}>
                    {task.priority}
                  </Badge>
                  <Button size="sm" variant="outline">
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-4">
              View All Tasks
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Your latest progress and updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 border rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">Profile Setup Completed</p>
                  <p className="text-sm text-gray-600">Great! Your preferences have been saved</p>
                  <p className="text-xs text-gray-400">Just now</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 border rounded-lg">
                <GraduationCap className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium">Roadmap Generated</p>
                  <p className="text-sm text-gray-600">Personalized plan ready for review</p>
                  <p className="text-xs text-gray-400">2 minutes ago</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 border rounded-lg">
                <FileText className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <p className="font-medium">Welcome to StudyMate AI</p>
                  <p className="text-sm text-gray-600">Your journey to study abroad begins here</p>
                  <p className="text-xs text-gray-400">5 minutes ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Jump into the most important tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-auto p-4 flex flex-col items-center gap-2" variant="outline">
              <FileText className="h-8 w-8" />
              <span>Generate Roadmap</span>
            </Button>
            <Button className="h-auto p-4 flex flex-col items-center gap-2" variant="outline">
              <GraduationCap className="h-8 w-8" />
              <span>Find Universities</span>
            </Button>
            <Button className="h-auto p-4 flex flex-col items-center gap-2" variant="outline">
              <DollarSign className="h-8 w-8" />
              <span>Budget Planner</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
