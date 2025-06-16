import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { processProfileWithLLM } from '@/lib/profile-processor';
import { Loader2 } from 'lucide-react';

interface ProfileData {
  budget?: string;
  preferredCountries?: string[];
  academicInterests?: string[];
  currentEducation?: string;
  workExperience?: string;
  englishProficiency?: string;
  timeline?: string;
  name?: string;
  email?: string;
  novitaApiKey?: string;
}

interface ProfileFormProps {
  onComplete: (data: ProfileData) => void;
  initialData?: ProfileData;
  isEdit?: boolean;
}

const ProfileForm = ({ onComplete, initialData = {}, isEdit = false }: ProfileFormProps) => {
  const [formData, setFormData] = useState<ProfileData>({
    budget: initialData.budget || '',
    preferredCountries: initialData.preferredCountries || [],
    academicInterests: initialData.academicInterests || [],
    currentEducation: initialData.currentEducation || '',
    workExperience: initialData.workExperience || '0',
    englishProficiency: initialData.englishProficiency || '',
    timeline: initialData.timeline || '',
    novitaApiKey: initialData.novitaApiKey || '',
    ...initialData
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const countries = [
    'United States', 'Canada', 'United Kingdom', 'Australia', 
    'Germany', 'Netherlands', 'Singapore', 'New Zealand'
  ];

  const fields = [
    'Computer Science', 'Engineering', 'Business Administration', 
    'Medicine', 'Arts & Humanities', 'Sciences', 'Economics', 'Law'
  ];

  const handleCountryChange = (country: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      preferredCountries: checked 
        ? [...(prev.preferredCountries || []), country]
        : (prev.preferredCountries || []).filter(c => c !== country)
    }));
  };

  const handleFieldChange = (field: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      academicInterests: checked 
        ? [...(prev.academicInterests || []), field]
        : (prev.academicInterests || []).filter(f => f !== field)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.budget || !formData.preferredCountries?.length || !formData.academicInterests?.length) {
      toast({
        title: "Incomplete Profile",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Process the profile with LLM
      const apiKey = formData.novitaApiKey || import.meta.env.VITE_NOVITA_API_KEY;
      
      if (!apiKey) {
        toast({
          title: "API Key Missing",
          description: "Please add your Novita AI API key in your profile settings or environment variables.",
          variant: "destructive"
        });
        return;
      }

      const processedProfile = await processProfileWithLLM(formData, apiKey);

      // Store the processed profile data in localStorage
      localStorage.setItem('processed_profile', JSON.stringify(processedProfile));

      toast({
        title: isEdit ? "Profile Updated!" : "Profile Created!",
        description: "Your personalized roadmap has been generated.",
      });

      // Pass both the form data and processed profile to the parent component
      onComplete({
        ...formData,
        processedProfile
      });
    } catch (error) {
      console.error('Error processing profile:', error);
      toast({
        title: "Error",
        description: "Failed to process your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className={isEdit ? "" : "backdrop-blur-sm bg-white/95"}>
      <CardHeader>
        <CardTitle>{isEdit ? "Update Profile" : "Tell us about yourself"}</CardTitle>
        <CardDescription>
          We'll use this information to create your personalized study abroad roadmap
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget">Budget (USD)</Label>
              <Select value={formData.budget} onValueChange={(value) => setFormData({...formData, budget: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your budget range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under-20k">Under $20,000</SelectItem>
                  <SelectItem value="20k-40k">$20,000 - $40,000</SelectItem>
                  <SelectItem value="40k-60k">$40,000 - $60,000</SelectItem>
                  <SelectItem value="60k-80k">$60,000 - $80,000</SelectItem>
                  <SelectItem value="above-80k">Above $80,000</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeline">When do you plan to start?</Label>
              <Select value={formData.timeline} onValueChange={(value) => setFormData({...formData, timeline: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timeline" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fall-2024">Fall 2024</SelectItem>
                  <SelectItem value="spring-2025">Spring 2025</SelectItem>
                  <SelectItem value="fall-2025">Fall 2025</SelectItem>
                  <SelectItem value="later">Later than 2025</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Preferred Countries (select all that apply)</Label>
            <div className="grid grid-cols-2 gap-2">
              {countries.map(country => (
                <div key={country} className="flex items-center space-x-2">
                  <Checkbox
                    id={country}
                    checked={formData.preferredCountries?.includes(country)}
                    onCheckedChange={(checked) => handleCountryChange(country, checked === true)}
                  />
                  <Label htmlFor={country} className="text-sm">{country}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Academic Interests (select all that apply)</Label>
            <div className="grid grid-cols-2 gap-2">
              {fields.map(field => (
                <div key={field} className="flex items-center space-x-2">
                  <Checkbox
                    id={field}
                    checked={formData.academicInterests?.includes(field)}
                    onCheckedChange={(checked) => handleFieldChange(field, checked === true)}
                  />
                  <Label htmlFor={field} className="text-sm">{field}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="education">Current Education Level</Label>
              <Select value={formData.currentEducation} onValueChange={(value) => setFormData({...formData, currentEducation: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select education level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high-school">High School</SelectItem>
                  <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                  <SelectItem value="masters">Master's Degree</SelectItem>
                  <SelectItem value="phd">PhD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="english">English Proficiency</Label>
              <Select value={formData.englishProficiency} onValueChange={(value) => setFormData({...formData, englishProficiency: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select proficiency level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="native">Native/Fluent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="novitaApiKey">Novita AI API Key (Optional)</Label>
            <Input
              id="novitaApiKey"
              type="password"
              placeholder="Enter your Novita AI API key"
              value={formData.novitaApiKey || ''}
              onChange={(e) => setFormData({...formData, novitaApiKey: e.target.value})}
            />
            <p className="text-xs text-gray-500">Your API key is stored locally and used for enhanced AI features.</p>
          </div>

          <Button type="submit" className="w-full" disabled={isProcessing}>
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEdit ? "Updating Profile..." : "Generating Roadmap..."}
              </>
            ) : (
              isEdit ? "Update Profile" : "Generate My Roadmap"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;
