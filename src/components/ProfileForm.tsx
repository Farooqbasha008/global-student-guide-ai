import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";

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
    ...initialData
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.budget || !formData.preferredCountries?.length || !formData.academicInterests?.length) {
      toast({
        title: "Incomplete Profile",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: isEdit ? "Profile Updated!" : "Profile Created!",
      description: "Your personalized roadmap is being generated...",
    });

    onComplete(formData);
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
                    checked={formData.preferredCountries.includes(country)}
                    onCheckedChange={(checked) => handleCountryChange(country, checked)}
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
                    checked={formData.academicInterests.includes(field)}
                    onCheckedChange={(checked) => handleFieldChange(field, checked)}
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

          <Button type="submit" className="w-full">
            {isEdit ? "Update Profile" : "Generate My Roadmap"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;
