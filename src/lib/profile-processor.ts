import { sendChatCompletion, ChatMessage } from './novita-ai';

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

interface ProcessedProfile {
  personalizedInsights: string[];
  recommendedUniversities: string[];
  scholarshipOpportunities: string[];
  visaRequirements: string[];
  timelineRecommendations: string[];
  budgetAnalysis: string;
  academicPath: string;
}

export async function processProfileWithLLM(
  profileData: ProfileData,
  apiKey: string
): Promise<ProcessedProfile> {
  try {
    const systemPrompt = `You are an expert study abroad advisor. Analyze the following student profile and provide detailed, personalized recommendations.
    Your response must be a valid JSON object with the following structure:
    {
      "personalizedInsights": ["insight1", "insight2", ...],
      "recommendedUniversities": ["university1", "university2", ...],
      "scholarshipOpportunities": ["scholarship1", "scholarship2", ...],
      "visaRequirements": ["requirement1", "requirement2", ...],
      "timelineRecommendations": ["recommendation1", "recommendation2", ...],
      "budgetAnalysis": "detailed budget analysis",
      "academicPath": "detailed academic path recommendation"
    }
    Do not include any other text or formatting. Only return the JSON object.`;

    const userPrompt = `Analyze this student profile and provide recommendations in JSON format:
    Name: ${profileData.name || 'Not provided'}
    Preferred Countries: ${profileData.preferredCountries?.join(', ') || 'Not specified'}
    Academic Interests: ${profileData.academicInterests?.join(', ') || 'Not specified'}
    Current Education: ${profileData.currentEducation || 'Not specified'}
    Work Experience: ${profileData.workExperience || 'Not specified'} years
    English Proficiency: ${profileData.englishProficiency || 'Not specified'}
    Budget: ${profileData.budget || 'Not specified'}
    Timeline: ${profileData.timeline || 'Not specified'}`;

    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    const response = await sendChatCompletion(
      messages,
      {
        temperature: 0.7,
        max_tokens: 2000
      },
      apiKey
    );

    // Extract the JSON string from the response
    const content = response.choices[0].message.content;
    
    // Try to find JSON in the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in the response');
    }

    // Parse the JSON
    const processedData = JSON.parse(jsonMatch[0]);

    // Validate the structure
    const requiredFields = [
      'personalizedInsights',
      'recommendedUniversities',
      'scholarshipOpportunities',
      'visaRequirements',
      'timelineRecommendations',
      'budgetAnalysis',
      'academicPath'
    ];

    for (const field of requiredFields) {
      if (!(field in processedData)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    return processedData;
  } catch (error) {
    console.error('Error processing profile with LLM:', error);
    // Return a default structure if processing fails
    return {
      personalizedInsights: [
        "Consider your budget when selecting universities",
        "Research scholarship opportunities",
        "Start preparing required documents early"
      ],
      recommendedUniversities: [
        "Research universities in your preferred countries",
        "Consider program rankings and reputation"
      ],
      scholarshipOpportunities: [
        "Look for country-specific scholarships",
        "Check university-specific funding options"
      ],
      visaRequirements: [
        "Gather required academic documents",
        "Prepare financial statements",
        "Check language proficiency requirements"
      ],
      timelineRecommendations: [
        "Start applications 6-8 months before intended start date",
        "Allow 2-3 months for visa processing"
      ],
      budgetAnalysis: "Consider tuition, living expenses, and additional costs when planning your budget",
      academicPath: "Research program requirements and prerequisites for your chosen field of study"
    };
  }
} 