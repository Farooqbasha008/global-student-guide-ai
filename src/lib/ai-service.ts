import { apiClient } from './api-client';
import { handleApiError, ErrorType } from './error-handler';

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    total_tokens: number;
  };
}

interface AIResponse {
  text: string;
  confidence: number;
  tokens: number;
}

interface AIConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
}

class AIService {
  private static instance: AIService;
  private config: AIConfig;
  private apiKey: string;

  private constructor() {
    this.config = {
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      maxTokens: 1000,
      topP: 1,
      frequencyPenalty: 0,
      presencePenalty: 0
    };
    this.apiKey = process.env.OPENAI_API_KEY || '';
  }

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  public setConfig(config: Partial<AIConfig>): void {
    this.config = { ...this.config, ...config };
  }

  public setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  public async generateText(prompt: string): Promise<AIResponse> {
    if (!this.apiKey) {
      throw handleApiError(new Error('API key not set'));
    }

    try {
      const response = await apiClient.post<OpenAIResponse>(
        'https://api.openai.com/v1/chat/completions',
        {
          model: this.config.model,
          messages: [{ role: 'user', content: prompt }],
          temperature: this.config.temperature,
          max_tokens: this.config.maxTokens,
          top_p: this.config.topP,
          frequency_penalty: this.config.frequencyPenalty,
          presence_penalty: this.config.presencePenalty
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );

      return {
        text: response.choices[0].message.content,
        confidence: response.choices[0].finish_reason === 'stop' ? 1 : 0.8,
        tokens: response.usage.total_tokens
      };
    } catch (error) {
      throw handleApiError(error);
    }
  }

  public async generateMultipleResponses(
    prompt: string,
    numResponses: number = 3
  ): Promise<AIResponse[]> {
    if (!this.apiKey) {
      throw handleApiError(new Error('API key not set'));
    }

    try {
      const response = await apiClient.post<OpenAIResponse>(
        'https://api.openai.com/v1/chat/completions',
        {
          model: this.config.model,
          messages: [{ role: 'user', content: prompt }],
          temperature: this.config.temperature,
          max_tokens: this.config.maxTokens,
          top_p: this.config.topP,
          frequency_penalty: this.config.frequencyPenalty,
          presence_penalty: this.config.presencePenalty,
          n: numResponses
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );

      return response.choices.map(choice => ({
        text: choice.message.content,
        confidence: choice.finish_reason === 'stop' ? 1 : 0.8,
        tokens: response.usage.total_tokens / numResponses
      }));
    } catch (error) {
      throw handleApiError(error);
    }
  }

  public async analyzeSentiment(text: string): Promise<{
    sentiment: 'positive' | 'negative' | 'neutral';
    score: number;
  }> {
    if (!this.apiKey) {
      throw handleApiError(new Error('API key not set'));
    }

    try {
      const response = await apiClient.post<OpenAIResponse>(
        'https://api.openai.com/v1/chat/completions',
        {
          model: this.config.model,
          messages: [
            {
              role: 'system',
              content: 'You are a sentiment analysis tool. Respond with a JSON object containing "sentiment" ("positive", "negative", or "neutral") and "score" (0-1).'
            },
            { role: 'user', content: text }
          ],
          temperature: 0.3,
          max_tokens: 100
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );

      const result = JSON.parse(response.choices[0].message.content);
      return {
        sentiment: result.sentiment,
        score: result.score
      };
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

// Export singleton instance
export const aiService = AIService.getInstance(); 